import React from 'react'
import Navbars from '../components/Navbars';
import './Features.css';

const Features = () => {
    return (
        <div>
            <Navbars />
            <div className='greenBox'>

                <h1 className='theTitle'>Fitur Kami</h1>

                <ol className='theList'>
                    <li>
                        <strong>Analisis Teks Otomatis:</strong> Masukkan deskripsi makanan secara bebas, dan kami akan memprosesnya menggunakan NLP.
                    </li>
                    <li>
                        <strong>Deteksi Makanan Cerdas:</strong> Sistem kami mengenali berbagai jenis makanan, termasuk lokal dan internasional.
                    </li>
                    <li>
                        <strong>Estimasi Nutrisi Lengkap:</strong> Dapatkan informasi kalori, protein, lemak, karbohidrat, dan lainnya secara instan.
                    </li>
                    <li>
                        <strong>Antarmuka Sederhana:</strong> Desain minimalis yang memudahkan siapa saja menggunakan aplikasi tanpa perlu belajar rumit.
                    </li>
                    <li>
                        <strong>Bahasa Natural:</strong> Tidak perlu format khusus — cukup tulis seperti "tadi makan mie ayam dan es teh manis".
                    </li>
                    <li>
                        <strong>Rekomendasi Sehat:</strong> Berikan saran perbaikan gizi untuk membantu hidup lebih seimbang dan sehat.
                    </li>
                    <li>
                        <strong>Riwayat Konsumsi:</strong> Lacak makanan yang sudah dianalisis untuk melihat pola makan harian atau mingguan.
                    </li>
                    <li>
                        <strong>Privasi Terjamin:</strong> Data pengguna disimpan dengan aman dan tidak dibagikan ke pihak ketiga.
                    </li>
                </ol>
            </div>
        </div>
    )
}

export default Features
