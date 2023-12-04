import {FC, useEffect} from 'react';
import {ISpectrum} from '../../models/models.ts';
import './CardItem.css'

interface SpectrumItemProps {
    Spectrum: ISpectrum;
    onClick: (num: number) => void,
}

const SpectrumItem: FC<SpectrumItemProps> = ({Spectrum, onClick}) => {
    const deleteClickHandler = () => {
        console.log(`tap ${Spectrum.id}`)
    }

    useEffect(() => {
        console.log(Spectrum)
    }, []);

    return (
        <div className="card" data-Spectrum-id={Spectrum.id} onClick={() => onClick(Spectrum.id)}>
            <img src={Spectrum.image_url} alt="Image" className="photo" id={`photo-${Spectrum.id}`}/>
            <div className="circle" onClick={deleteClickHandler}>
                <img src="http://localhost:8888/static/img/deleteTrash.png" alt="Deleted" className="deleted-trash"/>

            </div>
            <div className="container-card">
                {Spectrum.name}
            </div>
        </div>
    );
};

export default SpectrumItem;
