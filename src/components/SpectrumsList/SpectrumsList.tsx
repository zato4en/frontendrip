import {useNavigate} from 'react-router-dom';
import {FC, useEffect} from 'react';
import {ISpectrum} from "../../models/models.ts";
import List from "../List.tsx";
import SpectrumItem from "../SpectrumItem/SpectrumItem.tsx";
import './SpectrumsList.css'
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchSpectrums} from "../../store/reducers/ActionCreator.ts";
import LoadAnimation from "../Popup/MyLoaderComponent.tsx";
import MyComponent from "../Popup/Popover.tsx";

interface SpectrumsListProps {
    setPage: () => void
    searchValue?: string
    resetSearchValue: () => void;
}

const SpectrumsList: FC<SpectrumsListProps> = ({setPage, searchValue}) => {
    const dispatch = useAppDispatch()
    const {Spectrums, isLoading, error, success} = useAppSelector(state => state.SpectrumReducer)
    const navigate = useNavigate();

    useEffect(() => {
        setPage()
        dispatch(fetchSpectrums(searchValue))
    }, [searchValue]);

    return (
        <>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}
            <List items={Spectrums} renderItem={(Spectrum: ISpectrum) =>
                <SpectrumItem
                    key={Spectrum.id}
                    Spectrum={Spectrum}
                    isServer={true}
                    onClick={(num) => navigate(`/Spectrums/${num}`)}
                />
            }
            />
        </>
    )
};

export default SpectrumsList;