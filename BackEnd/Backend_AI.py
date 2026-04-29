import spacy
from spacy.util import minibatch
from spacy.training.example import Example
import re
from word2number import w2n
from googletrans import Translator
import pandas as pd
import numpy as np
import torch
from transformers import pipeline, BertTokenizer
from sentence_transformers import SentenceTransformer, util
from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import defaultdict
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

dataset = pd.read_csv(os.path.join(BASE_DIR, '../dataset/nutrition_cleaned.csv'))
dataset.drop(['image'], axis=1, inplace=True)
dataset['name'] = dataset['name'].str.lower()

translator = Translator()
trained_nlp = spacy.load(os.path.join(BASE_DIR, "food_ner_model"))

#database
import firebase_admin
from firebase_admin import credentials, firestore, auth


# Initialize Firebase
cred = credentials.Certificate(os.path.join(BASE_DIR, "firebase_key.json"))
firebase_admin.initialize_app(cred)

db = firestore.client()


# Login Registration API

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data['email']
    password = data['password']
    name = data['name']

    try:
        # Check if user exists
        auth.get_user_by_email(email)
        return jsonify({'error': 'User already exists'}), 400
    except auth.UserNotFoundError:
        pass  # kalo ngga ada user yg sama, lanjut ke home page

    try:
        user = auth.create_user(
            email=email,
            password=password,
            display_name=name,
        )

        db.collection('username').document(user.uid).set({
            'name': name,
        }, merge=True)

        return jsonify({'message': 'User created', 'uid': user.uid, 'name': user.display_name}), 201
    except Exception as e:
        print("Backend error:", e)
        return jsonify({'error': str(e)}), 500


@app.route('/api/users/getName', methods=['GET'])
def getName():
    uid = request.args.get("uid")
    if not uid:
        return jsonify({"error": "UID is required"}), 400

    user_ref = db.collection('username').document(uid)
    user = user_ref.get()
    if not user.exists:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"name": user.to_dict().get("name")}), 200

@app.route('/api/users/getBMR', methods=['POST'])
def getBMR():
    uid = request.json.get("uid")
    if not uid:
        return jsonify({"error": "UID is required"}), 400

    user_ref = db.collection('users').document(uid)
    user = user_ref.get()
    if not user.exists:
        return jsonify({"error": "User not found"}), 404
    user_data = user.to_dict()
    return jsonify({
        "bmr": user_data.get("bmr"),
        "carbs": user_data.get("carbs"),
        "protein": user_data.get("protein"),
        "fat": user_data.get("fat")
    }), 200

units_list = {"piring", "mangkuk", "gelas", "sendok", "kotak", "bungkus"}

@app.route('/api/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    prompt = data.get("prompt", "")

    matched_foods = getFoods(prompt)
    response = getNutrients(matched_foods)

    return jsonify({"response": response})

def getFoods(text):
    global dataset
    foods = []

    doc = trained_nlp(text)

    food_ents = []
    qty_ents = []

    for ent in doc.ents:
        if ent.label_ == "FOOD":
            food_ents.append({"text": ent.text, "start": ent.start_char})
        elif ent.label_ == "QTY":
            normalized_qty = normalize_qty(ent.text)
            if normalized_qty is not None:
                qty_ents.append({"text": ent.text, "value": normalized_qty, "start": ent.start_char})

    print(f"Text: {text}")
    print(f"FOODs: {food_ents}")
    print(f"QTYs: {qty_ents}")
    print("-" * 50) #buat cek hasil entitas

    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    dataset_foods = dataset['name'].tolist()
    dataset_embeddings = model.encode(dataset_foods, convert_to_tensor=True)

    matched_foods = []

    for food_ent in food_ents:
        food_text = food_ent["text"]
        food_start = food_ent["start"]

        closest_qty = None
        closest_dist = float('inf')
        for qty in qty_ents:
            dist = abs(food_start - qty["start"])
            if dist < closest_dist:
                closest_qty = qty
                closest_dist = dist

        mass = int(closest_qty["value"] * 100) if closest_qty else 100

        # Match the food
        if food_text in dataset_foods:
            matched_food = food_text
        else:
            food_embedding = model.encode(food_text, convert_to_tensor=True)
            scores = util.pytorch_cos_sim(food_embedding, dataset_embeddings)
            best_match_idx = scores.argmax().item()
            matched_food = dataset.iloc[best_match_idx]['name']

        matched_foods.append((matched_food, mass))

    print("Matched Foods with Mass:", matched_foods) #untuk mengecek hasil makanan yang cocok
    return matched_foods


def normalize_qty(qty_text):
    qty_text = qty_text.lower().strip()
    match = re.match(r"([\w\s]+)\s*(kilogram|kg)$", qty_text)
    if match:
        num_text = match.group(1).strip()
        try:
            translated = translator.translate(num_text, src='id', dest='en')
            num_value = w2n.word_to_num(translated.text)
        except ValueError:
            num_value = num_text
        return int(num_value) * 10

    match = re.match(r"([\w\s]+)\s*(gram|gr|g)$", qty_text)
    if match:
        num_text = match.group(1).strip()
        try:
            translated = translator.translate(num_text, src='id', dest='en')
            num_value = w2n.word_to_num(translated.text)
        except ValueError:
            num_value = num_text
        return int(num_value) / 100

    return None

def getNutrients(matched_foods):
    global dataset
    food_details = []
    total_protein = 0
    total_calories = 0
    total_fat = 0
    total_carbohydrate = 0

    for food, mass in matched_foods:
        matched_row = dataset[dataset['name'] == food]
        if not matched_row.empty:
            # Get values per 100g, then scale
            factor = mass / 100
            protein = matched_row['proteins'].values[0] * factor
            calories = matched_row['calories'].values[0] * factor
            fat = matched_row['fat'].values[0] * factor
            carbohydrate = matched_row['carbohydrate'].values[0] * factor

            total_protein += protein
            total_calories += calories
            total_fat += fat
            total_carbohydrate += carbohydrate

            food_details.append({
                "name": food,
                "mass": mass,
                "protein": round(protein, 2),
                "calories": round(calories, 2),
                "fat": round(fat, 2),
                "carbohydrate": round(carbohydrate, 2)
            })

    totals = {
        "total_protein": round(total_protein, 2),
        "total_calories": round(total_calories, 2),
        "total_fat": round(total_fat, 2),
        "total_carbohydrate": round(total_carbohydrate, 2)
    }
    return {"foods": food_details, "totals": totals}

@app.route('/api/bmr', methods=['POST'])
def calculate_bmr_route():
    data = request.get_json()
    uid = data.get('uid')
    gender = data.get("gender")
    weight = data.get("weight")
    height = data.get("height")
    age = data.get("age")
    activity = data.get("activity")  # Ambil level aktivitas dari frontend

    activity_map = {
        "T": 1.2,
        "R": 1.375,
        "S": 1.55,
        "A": 1.725,
        "SA": 1.9
    }

    # Validasi input
    if not all([gender, weight, height, age, activity]):
        return jsonify({"error": "Please provide gender, weight, height, age, and activity level"}), 400

    try:
        bmr = calculate_bmr(gender, weight, height, age)
        tdee, protein, carbs, fat = calculate_macros(bmr, activity_map.get(activity, 1.2))

        # Save to Firestore
        db = firestore.client()
        db.collection('users').document(uid).set({
            'bmr': bmr,
            'protein': protein,
            'carbs': carbs,
            'fat': fat
        }, merge=True)

        return jsonify({
            "bmr": round(bmr, 2),
            "tdee": round(tdee, 2),
            "protein": round(protein, 2),
            "carbs": round(carbs, 2),
            "fat": round(fat, 2)
        })
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

def calculate_bmr(gender, weight, height, age):
    """
    Menghitung Basal Metabolic Rate (BMR)
    :param gender: 'male' atau 'female'
    :param weight: berat badan dalam kg
    :param height: tinggi badan dalam cm
    :param age: usia dala tahun
    :return: nilai BMR
    
    """
    if gender.lower() == 'male':
        bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)
    elif gender.lower() == 'female':
        bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)
    else:
        raise ValueError("Gender harus 'male' atau 'female'")
    
    return bmr

def calculate_macros(bmr, activity_level):
    """
    Menghitung kebutuhan makronutrien berdasarkan BMR dan tingkat aktivitas
    :param bmr: nilai BMR yang dihitung sebelumnya
    :param activity_level: faktor aktivitas (1.2 - 2.5)
    :return: kebutuhan kalori, protein, karbohidrat, dan lemak
    """
    tdee = bmr * activity_level
    protein = (tdee * 0.2) / 4  # 20% kalori dari protein (4 kalori per gram)
    carbs = (tdee * 0.5) / 4     # 50% kalori dari karbohidrat (4 kalori per gram)
    fat = (tdee * 0.3) / 9       # 30% kalori dari lemak (9 kalori per gram)
    
    return tdee, protein, carbs, fat

if __name__ == '__main__':
    app.run(debug=True, port=8000)