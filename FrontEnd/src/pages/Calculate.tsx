import { useState } from "react";
import axios from "axios";
import "../App.css";
import "./Calculate.css";
import Navbars from "../components/Navbars";
import { useAppContext } from "../global/AppContext.tsx";
import { useNavigate } from "react-router-dom";

interface FoodData {
  name: string;
  mass: number;
  protein: number;
  calories: number;
  fat: number;
  carbohydrate: number;
}

interface NutritionResponse {
  foods: FoodData[];
  totals: {
    total_protein: number;
    total_calories: number;
    total_fat: number;
    total_carbohydrate: number;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Calculate = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<NutritionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    addEntry,
    setCurrCarbos,
    setCurrBMR,
    setCurrFat,
    setCurrProteins,
  } = useAppContext();

  const handleSubmit = async () => {
    try {
      setErrorMessage(null);

      const res = await axios.post(`${API_BASE_URL}/api/calculate`, { prompt });
      const { foods, totals } = res.data.response;

      setResponse(res.data.response);
      addEntry({
        prompt,
        foods: foods.map((f: FoodData) => f.name).join(", "),
        calorieFood: totals.total_calories,
        proteinFood: totals.total_protein,
        carbFood: totals.total_carbohydrate,
        fatFood: totals.total_fat,
      });

      setCurrCarbos((prev) => prev + totals.total_carbohydrate);
      setCurrBMR((prev) => prev + totals.total_calories);
      setCurrFat((prev) => prev + totals.total_fat);
      setCurrProteins((prev) => prev + totals.total_protein);
    } catch (error) {
      setErrorMessage("Failed to fetch data. Please try again.");
      console.error("API Error:", error);
    }
  };

  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    navigate("/hasil");
  };

  return (
    <div className="wrapper">
      <Navbars />
      <div className="kalulatorImage">
        <h1 className="kalkulatorTitle">Kalkulator Kalori Makanan</h1>
      </div>

      <div className="greenBox">
        <p className="descTxt">Masukkan deskripsi makanan Anda</p>

        <textarea
          className="textbox"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: Justin makan 200 gram nasi goreng dengan 1 ayam goreng"
          spellCheck="false"
        />

        {!response ? (
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            className="submitButton"
          >
            Submit
          </button>
        ) : (
          <div style={{ display: 'none' }}></div>
        )}

        {errorMessage && <p className="error">{errorMessage}</p>}

        {response && (
          <div className="resultCard">
            {response.foods.length > 0 ? (
              <>
                <h2 className="sectionTitle">Makanan Terdeteksi</h2>
                <ul className="foodList">
                  {response.foods.map((food, index) => (
                    <li key={index} className="foodItem">
                      <strong>{food.name} ({food.mass}g)</strong>
                      <div className="foodDetails">
                        <span>Kalori: {food.calories} kcal</span>
                        <span>Protein: {food.protein} g</span>
                        <span>Lemak: {food.fat} g</span>
                        <span>Karbohidrat: {food.carbohydrate} g</span>
                      </div>
                    </li>
                  ))}
                </ul>

                <h2 className="sectionTitle">Total Nutrisi</h2>
                <div className="totalNutrition">
                  <span><strong>Kalori:</strong> {response.totals.total_calories} kcal</span>
                  <span><strong>Protein:</strong> {response.totals.total_protein} g</span>
                  <span><strong>Lemak:</strong> {response.totals.total_fat} g</span>
                  <span><strong>Karbohidrat:</strong> {response.totals.total_carbohydrate} g</span>
                </div>
              </>
            ) : (
              <p>Tidak ada makanan yang terdeteksi. Silakan coba deskripsi lain.</p>
            )}
          </div>
        )}
        {!response ? (
          <div style={{ display: 'none' }}></div>
        ) : (
          !confirmed && (
            <div>
              <button
                onClick={handleSubmit}
                disabled={!prompt.trim()}
                className="submitButtonAgain"
              >
                Submit Again
              </button>
              <button className="confirmButton" onClick={handleConfirm}>
                Confirm
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Calculate;
