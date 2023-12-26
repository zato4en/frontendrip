import {FC} from 'react';
import {ISpectrum} from '../../models/models.ts';
import './CardItem.css'
import {addSpectrumIntoSatellite} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {SpectrumSlice} from "../../store/reducers/SpectrumSlice.ts";

interface SpectrumItemProps {
    Spectrum: ISpectrum;
    onClick: (num: number) => void,
    isServer: boolean
}

const SpectrumItem: FC<SpectrumItemProps> = ({Spectrum, onClick, isServer}) => {

    const dispatch = useAppDispatch()
    const {increase} = SpectrumSlice.actions
    const {isAuth} = useAppSelector(state => state.userReducer)
    const {serialNumber} = useAppSelector(state => state.SpectrumReducer)

    const plusClickHandler = () => {
        dispatch(increase())
        dispatch(addSpectrumIntoSatellite(Spectrum.id, serialNumber, Spectrum.name ?? "Без названия"))
    }

    return (
        <div className="card-Spectrum-item" data-Spectrum-id={Spectrum.id}>
            <img
                src={Spectrum.image_url}
                alt="Image"
                className="photo"
                onClick={() => onClick(Spectrum.id)}
                id={`photo-${Spectrum.id}`}
            />
            {isServer && isAuth && (
                <div className="circle" onClick={plusClickHandler}>
                    <img
                        src="/plus.png"
                        alt="+"
                        className="deleted-trash"
                    />
                </div>
            )}
            <div className="container-card" onClick={() => onClick(Spectrum.id)}>{Spectrum.name}</div>
        </div>
    );
};

export default SpectrumItem;
