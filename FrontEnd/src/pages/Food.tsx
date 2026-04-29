//Components
import Navbars from '../components/Navbars';
//css
import './Food.css' //oke itu udah kelas sih. tAMBAHIN BANG. oke oke
const Food = () => {
    return (
        <div className='food-page'>
            <Navbars />
            <div className='food-container'>
                <title>Kalkulator kalori makanan</title>
                <div className='form'>
                    <label>Masukkan deskripsi makanan anda</label>
                    <textarea id="food-desc" placeholder='Misalnya: Nasi goreng dengan ayam dan telur'></textarea>
                    <button id="submit-btn">Submit</button>
                </div>
            </div>
        </div>
    );
}

export default Food;

