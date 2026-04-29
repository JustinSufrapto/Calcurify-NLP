import { useNavigate } from "react-router-dom";
import { JSX, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Modal from "../components/Modal";

interface Props {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(() => !!localStorage.getItem("uid"));
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                localStorage.setItem("uid", user.uid);
                setAuthenticated(true);
            } else {
                localStorage.removeItem("uid");
                setAuthenticated(false);
                setShowModal(true); // Show modal if user is not authenticated
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!authenticated && showModal) {
        return (
            <Modal
                message="You must be logged in to access this page."
                onClose={() => navigate("/login")}
            />
        );
    }

    return children;
};

export default ProtectedRoute;
