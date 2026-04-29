import { useState } from "react";
import axios from "axios";
import Navbars from '../components/Navbars';
import { useContext } from "react";
import { useAppContext } from '../global/AppContext.tsx';
import './BMR.css'

const BMR = () => {
    const [gender, setGender] = useState<string>("");
    const [weight, setWeight] = useState<string>(""); // string so you can bind to <input>
    const [height, setHeight] = useState<string>("");
    const [age, setAge] = useState<string>("");
    const [activity, setActivity] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [response, setResponse] = useState<number | null>(null);

    const context = useAppContext();
    const { setIsReady, setBmr, setProteins, setCarbos, setFats } = context;

    const handleSubmit = async () => {
        try {
            setErrorMessage('');

            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

            const uid = localStorage.getItem("uid");

            const payload = {
                uid, // added
                gender,
                weight: parseFloat(weight),
                height: parseFloat(height),
                age: parseInt(age, 10),
                activity,
            };

            const res = await axios.post(`${API_URL}/api/bmr`, payload);

            setResponse(res.data.bmr);
            setBmr(res.data.tdee);
            setProteins(res.data.protein);
            setCarbos(res.data.carbs);
            setFats(res.data.fat);
            setIsReady(true);


        } catch (error) {
            setErrorMessage("Failed to fetch data. Please try again.");
            console.error("Error calling API:", error);
        }
    };
    return (
        <div className='BMR-page'>
            <Navbars />
            <div className='bmr-container'>
                <div className='bmr-left'>
                    <h2>BMR <br />Calculator</h2>

                    <div className='form-row'>
                        <div className='form'>
                            <label>Jenis kelamin</label>
                            <select value={gender} onChange={e => setGender(e.target.value)}>
                                <option value="">Pilih jenis kelamin</option>
                                <option value="male">Laki-laki</option>
                                <option value="female">Perempuan</option>
                            </select>
                        </div>
                        <div className='form'>
                            <label>Intensitas aktivitas fisik</label>
                            <select value={activity} onChange={e => setActivity(e.target.value)}>
                                <option value="">Pilih intensitas</option>
                                <option value="T">Tidak Aktif</option>
                                <option value="R">Ringan</option>
                                <option value="S">Sedang</option>
                                <option value="A">Aktif</option>
                                <option value="SA">Sangat Aktif</option>
                            </select>
                        </div>
                    </div>
                    <div className='form-row'>
                        <div className='form'>
                            <label>Tinggi Badan</label>
                            <input type="text" placeholder='cm' onChange={e => setHeight(e.target.value)} />
                        </div>
                        <div className='form'>
                            <label>Berat Badan</label>
                            <input type="text" placeholder='kg' onChange={e => setWeight(e.target.value)} />
                        </div>
                    </div>

                    <div className='form'>
                        <label>Umur</label>
                        <input type="text" placeholder='Masukkan umur' onChange={e => setAge(e.target.value)} />
                    </div>

                    <div className='bmr-button'>
                        {/* <input type="text" placeholder='Mari hitung BMR anda' /> */}
                        <button onClick={handleSubmit}>Hitung</button>
                    </div>
                </div>

                <div className='bmr-right'>
                    <div className='result-box'>
                        <p><strong>BMR anda adalah</strong></p>
                        <div className='result-value'>{response ? response : 0} <span>kcal</span></div>

                        <p><strong>Kalori yang anda bakar dalam sehari adalah</strong></p>
                        <div className='result-value'>{response ? response : 0} <span>kcal</span></div>
                    </div>
                </div>
            </div>
            <div className='note-section'>
                <div className='note-icon'>⚠️</div>
                <div className='note-text'>
                    <p><strong>Catatan:</strong></p>
                    <p>
                        Hasil dari kalkulator BMR ini bukanlah sebuah alat diagnosis medis ataupun pengganti konsultasi dokter. <br />
                        Perlu diingat bahwa ada beberapa faktor yang memengaruhi hasil kalkulator BMR ini, dari usia, kondisi <br />
                        tubuh masing-masing, berat badan, tinggi badan, hingga aktivitas harian. Sebelum mengubah gaya hidup, <br />
                        pastikan Anda konsultasi dengan dokter terlebih dahulu.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default BMR;