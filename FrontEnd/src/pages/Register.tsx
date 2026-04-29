import { useState } from 'react';
import Navbars from '../components/Navbars';
import './Register.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAppContext } from '../global/AppContext';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUid } = useAppContext();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/api/register`, {
                name,
                email,
                password,
            });

            // console.log("Registration success:", res.data);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setUid(user.uid);
            localStorage.setItem("name", name);
            navigate("/home", { replace: true });
        } catch (err: any) {
            console.error(err.response?.data || err.message);
            setError(err.response?.data?.error || "Registration failed.");
        }
    };

    return (
        <div>
            <Navbars />
            <div className='wholePageReg'>
                <div className='greenBoxReg'>
                    <h1 className='regTitle'>Registrasi</h1>
                    <div className='regBox'>
                        <label>Name</label>
                        <input type='text' className='textInputReg' value={name} onChange={(e) => setName(e.target.value)} />
                        <label>Email</label>
                        <input type='text' className='textInputReg' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label>Password</label>
                        <input type='password' className='textInputReg' value={password} onChange={(e) => setPassword(e.target.value)} />
                        <label>Confirm Password</label>
                        <input type='password' className='textInputReg' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <div className='buttonCenter'>
                            <button className='clickButton' onClick={handleRegister}>Register</button>
                        </div>
                        <p className='smallTxtReg'>Already have an account? <Link to="/login">Login</Link> here</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
