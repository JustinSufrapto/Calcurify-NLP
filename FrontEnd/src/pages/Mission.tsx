import Navbars from '../components/Navbars';
import './Mission.css';

const Mission = () => {
    return (
        <div>
            <Navbars />
            <div className='greenBox'>

                <h1 className='theTitle'>Misi Kami</h1>

                <ol className='theList'>
                    <li>
                        <strong>Tujuan Utama:</strong> Membantu masyarakat memahami kandungan nutrisi dalam makanan mereka hanya dengan mengetikkan deskripsi makanan secara bebas.
                    </li>
                    <li>
                        <strong>Teknologi yang Digunakan:</strong> Kami memanfaatkan <strong>Natural Language Processing (NLP)</strong> untuk mengenali makanan dan nutrisi dari teks yang Anda masukkan.
                    </li>
                    <li>
                        <strong>Permasalahan yang Diselesaikan:</strong> Banyak orang kesulitan melacak asupan gizi harian. Dengan Calculify, Anda cukup mengetik "Saya makan ayam goreng dan nasi uduk" dan kami akan memberikan estimasi kalori, protein, lemak, dan lainnya.
                    </li>
                    <li>
                        <strong>Visi:</strong> Mewujudkan dunia di mana informasi gizi mudah diakses, dipahami, dan digunakan dalam kehidupan sehari-hari oleh siapa pun.
                    </li>
                    <li>
                        <strong>Misi Kami:</strong> Menyederhanakan pelacakan nutrisi agar siapa pun bisa hidup lebih sehat dengan informasi yang akurat dan mudah dimengerti.
                    </li>
                    <li>
                        <strong>Nilai-Nilai Kami:</strong> Akurasi, Kesederhanaan, Edukasi, dan Keamanan Data Pengguna.
                    </li>
                    <li>
                        <strong>Manfaat untuk Pengguna:</strong> Tidak perlu lagi menebak-nebak kandungan kalori atau membaca label gizi — Calculify melakukannya untuk Anda.
                    </li>

                </ol>
            </div>
        </div>
    )
};

export default Mission;
