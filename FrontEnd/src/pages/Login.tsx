import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import Navbars from '../components/Navbars';
import './Register.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAppContext } from '../global/AppContext';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUid } = useAppContext();

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // console.log("Login success:", user);
            // Redirect setelah login
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
            const res = await axios.get(`${API_URL}/api/users/getName`, {
                params: { uid: user.uid }
            });
            localStorage.setItem("name", res.data.name);
            setUid(user.uid);
            navigate("/home", { replace: true });
        } catch (err: any) {
            console.error(err);
            setError("Login failed. Check your email/password.");
        }
    };

    return (
        <div>
            <Navbars />
            <div className='wholePageReg'>
                <div className='greenBoxReg'>
                    <h1 className='regTitle'>Login</h1>
                    <div className='regBox'>
                        <label>Email</label>
                        <input
                            type='text'
                            className='textInputReg'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label>Password</label>
                        <input
                            type='password'
                            className='textInputReg'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                    <button type='submit' className='clickButton' onClick={handleLogin}>
                        Login
                    </button>
                    <p className='smallTxtReg'>
                        Did not have an account? <Link to="/register">Register</Link> here
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
