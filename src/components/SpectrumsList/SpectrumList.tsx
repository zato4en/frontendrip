import {useNavigate} from 'react-router-dom';
import {FC, useEffect, useState} from 'react';
import {ISpectrum, mockSpectrums} from "../../models/models.ts";
import List from "../List.tsx";
import SpectrumItem from "../SpectrumItem/SpectrumItem.tsx";
import './SpectrumList.css'

const SpectrumList: FC = () => {
    const [Spectrums, setSpectrums] = useState<ISpectrum[]>([]);
    const navigate = useNavigate();
    let searchValue = ''
    useEffect(() => {
        fetchSpectrums().catch((err) => {
            console.error(err);
            if (searchValue) {
                const filteredSpectrums = mockSpectrums.filter(Spectrum =>
                    Spectrum.name?.toLowerCase().includes(searchValue.toLowerCase())
                );
                setSpectrums(filteredSpectrums);
            } else {
                setSpectrums(mockSpectrums);
            }
        });
    },[]);

    async function fetchSpectrums() {
        try {
            const currentURL = window.location.href;
            const url = new URL(currentURL);
            let apiUrl = 'http://localhost:8888/Spectrums';

            if (url.searchParams.has('search')) {
                searchValue = url.searchParams.get('search') ?? '';
                apiUrl += `?search=${searchValue}`;
            }

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setSpectrums(data.Spectrums);
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    return (
        <List items={Spectrums} renderItem={(Spectrum: ISpectrum) =>
            <SpectrumItem Spectrum={Spectrum} onClick={(num) => navigate(`/frontendrip/spectrums/${num}`)}/>
        }
        />
    );
};

export default SpectrumList;