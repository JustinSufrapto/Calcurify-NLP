import { useEffect, useState } from 'react';
import logoSendok from '../assets/logoSendok.png';
import { Link, useNavigate } from "react-router-dom";
import "./Navbars.css";
import userIcon from "../assets/user.png";
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAppContext } from '../global/AppContext';


const Navbars = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate()
    const { setUid } = useAppContext();

    useEffect(() => {
        let name = localStorage.getItem("name");
        setUserName(name);
        if (name === "undefined") {
            name = null;
        }
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem("name");
        localStorage.removeItem("uid");
        setUid(null);
        navigate("/login", { replace: true });
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div className='leftPart'>
                <div className="logo">
                    <img src={logoSendok} alt="Logo sendok" />
                </div>
                <ul className="nav-links">
                    <li><Link to="/Home">Home</Link></li>
                    <li><Link to="/features">Our features</Link></li>
                    <li><Link to="/mission">Our missions</Link></li>
                </ul>
            </div>
            <div className="rightPart">
                {userName && (
                    <div className="nav-user-dropdown">
                        <p className="nav-user">Hello, {userName}</p>
                        <button
                            className="user-dropdown-btn"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <img id="userimg" src={userIcon} alt="" />
                        </button>
                        {showDropdown && (
                            <div className="dropdown-content">
                                <button className="logout-btn" onClick={handleLogout}>
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbars;
