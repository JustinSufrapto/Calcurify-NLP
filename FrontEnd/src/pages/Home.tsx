import { useNavigate } from "react-router-dom";
import './Home.css';
//Components
import Navbars from '../components/Navbars';
//Assets
import background from '../assets/half_Eclipse_BG.png';
import Ramen from '../assets/Ramen.png'
import LeafFood from '../assets/LeafFood.png'
import { useAppContext } from '../global/AppContext.tsx';

const Home = () => {
    const navigate = useNavigate();
    const { isReady } = useAppContext();


    return (
        <div className="home-container">
            <div className='home-background'>
                <img src={background} alt="Lah ilang" id='background-img' />
            </div>
            <Navbars />
            <main className='main-content'>
                <section className='left'>
                    <h1>Kalori Tracker</h1>
                    <p>Pantau asupan kalorimu dengan mudah!</p>

                    <div className='buttons'>
                        <div className='btn-top'>
                            <button className='btn btn-green' onClick={() => navigate("/BMR")}>BMR Page</button>
                            <button
                                className={`btn ${isReady ? 'btn-green' : 'btn-grey'}`}
                                onClick={() => navigate("/hasil")}
                                disabled={!isReady}
                            >
                                Hasil Page
                            </button>
                        </div>
                        <div className='btn-bottom'>
                            <button
                                className={`btn ${isReady ? 'btn-green' : 'btn-grey'}`}
                                onClick={() => navigate("/calculate")}
                                disabled={!isReady}>Prompt Page</button>
                        </div>
                    </div>
                </section>
                <section className='right'>
                    <div className='ramen-wrapper'>
                        <div className='green-circle'></div>
                        <img src={Ramen} alt="ramen" className='ramen-img' />
                    </div>
                </section>
                <img src={LeafFood} alt="leaf" className='LeafFood' />
            </main>
        </div>
    );
};



export default Home;
