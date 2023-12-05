import {useNavigate} from 'react-router-dom';
import {FC, useEffect, useState} from 'react';
import {ISpectrum, mockSpectrums} from "../../models/models.ts";
import List from "../List.tsx";
import SpectrumItem from "../SpectrumItem/SpectrumItem.tsx";
import './SpectrumsList.css'

interface SpectrumsListProps {
    setPage: () => void
    searchValue?: string
    resetSearchValue: () => void;
}

const SpectrumsList: FC<SpectrumsListProps> = ({setPage, searchValue, resetSearchValue}) => {
    const [Spectrums, setSpectrums] = useState<ISpectrum[]>([]);
    const [serverIsWork, setServerStatus] = useState<boolean>(false);
    const [reloadPage, setReloadPage] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        setPage()
        fetchSpectrums()
            .catch((err) => {
                console.log(err)
                filterMockData()
            });
    }, [searchValue, reloadPage]);

    const fetchSpectrums = async () => {
        const url = 'http://localhost:8888/Spectrums' + `?search=${searchValue ?? ''}`;

        const response = await fetch(url, {
            method: "GET",
            signal: AbortSignal.timeout(1000)
        })

        if (!response.ok) {
            setServerStatus(false)
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setServerStatus(true)
        if (data.Spectrums == null) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            document.getElementById('search-text-field').value = ""
            alert("Данных нету")
            resetSearchValue()
        }
        setSpectrums(data.Spectrums ?? []);
    }

    const filterMockData = () => {
        if (searchValue) {
            const filteredSpectrums = mockSpectrums.filter(spectrum =>
                spectrum.name?.toLowerCase().includes((searchValue ?? '').toLowerCase())
            );
            if (filteredSpectrums.length === 0) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                document.getElementById('search-text-field').value = ""
                alert("Данных нету")
                resetSearchValue()
            }
            setSpectrums(filteredSpectrums);
        } else {
            setSpectrums(mockSpectrums);
        }
    }

    return (
        <List items={Spectrums} renderItem={(Spectrum: ISpectrum) =>
            <SpectrumItem
                key={Spectrum.id}
                Spectrum={Spectrum}
                isServer={serverIsWork}
                onClick={(num) => navigate(`/Spectrum/${num}`)}
                reloadPage={() => {
                    setReloadPage(true)
                }}
            />
        }
        />
    );
};

export default SpectrumsList;