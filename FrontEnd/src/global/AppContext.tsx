import axios from 'axios';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface NutritionEntry {
    prompt: string;
    foods: string;
    calorieFood: number | null;
    proteinFood: number | null;
    carbFood: number | null;
    fatFood: number | null;
}


interface AppContextType {
    uid: string | null;
    setUid: React.Dispatch<React.SetStateAction<string | null>>;
    isReady: boolean;
    setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
    bmr: number | null;
    setBmr: React.Dispatch<React.SetStateAction<number | null>>;
    proteins: number | null;
    setProteins: React.Dispatch<React.SetStateAction<number | null>>;
    carbos: number | null;
    setCarbos: React.Dispatch<React.SetStateAction<number | null>>;
    fats: number | null;
    setFats: React.Dispatch<React.SetStateAction<number | null>>;
    currBMR: number;
    setCurrBMR: React.Dispatch<React.SetStateAction<number>>;
    currProtein: number;
    setCurrProteins: React.Dispatch<React.SetStateAction<number>>;
    currCarbos: number;
    setCurrCarbos: React.Dispatch<React.SetStateAction<number>>;
    currFat: number;
    setCurrFat: React.Dispatch<React.SetStateAction<number>>;
    entries: NutritionEntry[];
    addEntry: (entry: NutritionEntry) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [isReady, setIsReady] = useState<boolean>(false);
    const [bmr, setBmr] = useState<number | null>(null);
    const [proteins, setProteins] = useState<number | null>(null);
    const [carbos, setCarbos] = useState<number | null>(null);
    const [fats, setFats] = useState<number | null>(null);
    const [entries, setEntries] = useState<NutritionEntry[]>([]);
    const [currProtein, setCurrProteins] = useState<number>(0);
    const [currFat, setCurrFat] = useState<number>(0);
    const [currCarbos, setCurrCarbos] = useState<number>(0);
    const [currBMR, setCurrBMR] = useState<number>(0);

    const addEntry = (entry: NutritionEntry) => {
        setEntries(prev => [...prev, entry]);
    };

    const [uid, setUid] = useState<string | null>(localStorage.getItem("uid"));

    useEffect(() => {
        const storedUid = localStorage.getItem("uid");
        if (storedUid && !uid) setUid(storedUid);
    }, []);

    useEffect(() => {
        if (!uid) return;

        const fetchBMR = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
                const res = await axios.post(`${API_URL}/api/users/getBMR`, { uid });
                const { bmr, carbs, protein, fat } = res.data;

                setBmr(Math.round(bmr));
                setProteins(Math.round(protein));
                setCarbos(Math.round(carbs));
                setFats(Math.round(fat));
                setIsReady(true);
            } catch (error) {
                console.error("Failed to fetch BMR data:", error);
            }
        };

        fetchBMR();
    }, [uid]);


    useEffect(() => {
        console.log('entry anda:', entries);
    }, [entries]);

    return (
        <AppContext.Provider value={{
            isReady, setIsReady, bmr, setBmr, proteins, setProteins, carbos, setCarbos, fats, setFats, entries,
            addEntry, setCurrCarbos, currCarbos, currBMR, setCurrBMR, currFat, setCurrFat, currProtein, setCurrProteins, uid, setUid
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used inside AppProvider");
    return context;
};
