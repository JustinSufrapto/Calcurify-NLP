import Speedometer from '../components/SpeedoMeter'
import './Hasil.css'
import Navbars from '../components/Navbars';
import BigSpeedometer from '../components/BigSpeedoMeter';
import { useAppContext } from '../global/AppContext.tsx';

const Hasil = () => {
    const { bmr, proteins, carbos, fats, entries, currBMR, currCarbos, currFat, currProtein } = useAppContext();

    function getTodayDateIndo(): string {
        const today = new Date();
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(today);
    }

    function getStatus(
        currBMR: number,
        bmr: number,
        currCarbos: number,
        carbos: number,
        currProtein: number,
        proteins: number,
        currFat: number,
        fats: number
    ): string {
        const ratio = (curr: number, target: number) => target ? curr / target : 1;

        const bmrRatio = ratio(currBMR, bmr);
        const carbRatio = ratio(currCarbos, carbos);
        const proteinRatio = ratio(currProtein, proteins);
        const fatRatio = ratio(currFat, fats);

        const allRatios = [bmrRatio, carbRatio, proteinRatio, fatRatio];

        const allOver110 = allRatios.every(r => r > 1.1);
        const allBetween90to110 = allRatios.every(r => r >= 0.9 && r <= 1.1);

        if (allOver110) return "Berlebih";
        if (allBetween90to110) return "Baik";
        return "Kurang";
    }

    return (
        <>
            <Navbars />
            <div className='topPart'>
                <div className='topTxtPart'>
                    <h1 id='date'>Hari ini</h1>
                    <p className='middleTxt'>{getTodayDateIndo()}</p>
                </div>
                <div className='topMiddlePart'>
                    <div className='textLeft'>
                        <p className='bigTxt'>Dimakan</p>
                        <h1>{currBMR}</h1>
                        <p>cal</p>
                    </div>
                    <div className='hasil-container'>
                        <BigSpeedometer
                            value={bmr ? Math.abs(currBMR / bmr * 100) : 0}
                            centerText={
                                getStatus(
                                    currBMR, bmr ? bmr : 0,
                                    currCarbos, carbos ? carbos : 0,
                                    currProtein, proteins ? proteins : 0,
                                    currFat, fats ? fats : 0
                                ) === "Kurang"
                                    ? 'cal terisa'
                                    : getStatus(
                                        currBMR, bmr ? bmr : 0,
                                        currCarbos, carbos ? carbos : 0,
                                        currProtein, proteins ? proteins : 0,
                                        currFat, fats ? fats : 0
                                    ) === "Berlebih"
                                        ? 'cal berlebih'
                                        : 'cal cukup'
                            }
                            widths={320}
                            heights={320}
                            percentage={bmr ? Math.abs(bmr - currBMR) : 0}
                        />
                    </div>
                    <div className='textRight'>
                        <p className='bigTxt'>Status</p>
                        <h1>{getStatus(currBMR, bmr ? bmr : 0, currCarbos, carbos ? carbos : 0, currProtein, proteins ? proteins : 0, currFat, fats ? fats : 0)}</h1>
                    </div>
                </div>
                <div className='nutritionsPart'>
                    <div className='eachNutritions'>
                        <h2>Karbohidrat</h2>
                        <Speedometer value={carbos ? currCarbos / carbos * 100 : 0} centerText={currCarbos + '/' + carbos?.toString() + 'gr'} widths={250} heights={250} />
                    </div>
                    <div className='eachNutritions'>
                        <h2>Protein</h2>
                        <Speedometer value={proteins ? currProtein / proteins * 100 : 0} centerText={currProtein + '/' + proteins?.toString() + 'gr'} widths={250} heights={250} />
                    </div>
                    <div className='eachNutritions'>
                        <h2>Lemak</h2>
                        <Speedometer value={fats ? currFat / fats * 100 : 0} centerText={currFat + '/' + fats?.toString() + 'gr'} widths={250} heights={250} />
                    </div>

                </div>
            </div>
            <div className='bagianRiwayat'>
                <h2 className='riwayatTitle'>Riwayat Prompt</h2>

                {entries.length === 0 ? (
                    <p>Tidak ada riwayat.</p>
                ) : (
                    entries.map((entry, index) => (
                        <div key={index} className='whiteCard'>

                            <div className='textCard'>
                                <p>Prompt : {entry.prompt}</p>
                                <p>Makanan: {entry.foods}</p>
                                <div className='nutritionDesc'>
                                    <p>Kalori: {entry.calorieFood ?? '-'} Cal</p>
                                    <p>Karbohidrat: {entry.carbFood ?? '-'} gr</p>
                                    <p>Protein: {entry.proteinFood ?? '-'} gr</p>
                                    <p>Lemak: {entry.fatFood ?? '-'} gr</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}

            </div>
        </>
    )
}

export default Hasil
