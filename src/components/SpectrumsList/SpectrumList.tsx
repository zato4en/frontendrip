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
import Button from "react-bootstrap/Button";

interface SpectrumsListProps {
    setPage: () => void
}

const SpectrumList: FC<SpectrumsListProps> = ({setPage}) => {
    const dispatch = useAppDispatch()
    const {Spectrums, isLoading, error, success, basketID} = useAppSelector(state => state.SpectrumReducer)
    const navigate = useNavigate();
    const {searchValue} = useAppSelector(state => state.progressReducer)

    useEffect(() => {
        setPage()
        dispatch(fetchSpectrums(searchValue))
    }, [searchValue]);

    const didTapBasket = () => {
        navigate(`/Satellites/${basketID}`);
    }

    if (!Spectrums) {
        return <h3>Данных нет</h3>
    }

    return (
        <>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                <Button
                    variant="primary"
                    onClick={didTapBasket}
                    disabled={basketID == 0}
                    style={{position: 'absolute', right: 40}}
                >
                    Создать поход
                </Button>
            </div>
            <List items={Spectrums ?? []} renderItem={(Spectrum: ISpectrum) =>
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

export default SpectrumList;