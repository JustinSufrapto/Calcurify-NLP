import "./Modal.css"; // optional, for better styling

interface ModalProps {
    message: string;
    onClose: () => void;
}

const Modal = ({ message, onClose }: ModalProps) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <h3>{message}</h3>
            <button onClick={onClose}>OK</button>
        </div>
    </div>
);

export default Modal;
