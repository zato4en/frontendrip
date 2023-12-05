import {FC} from 'react';
import {ISpectrum} from '../../models/models.ts';
import './CardItem.css'


interface SpectrumItemProps {
    Spectrum: ISpectrum;
    onClick: (num: number) => void,
    isServer: boolean
    reloadPage: () => void
}

const SpectrumItem: FC<SpectrumItemProps> = ({Spectrum, onClick, isServer, reloadPage}) => {
    const deleteClickHandler = () => {
        DeleteData()
            .then(() => {
                console.log(`Spectrum with ID ${Spectrum.id} successfully deleted.`);
            })
            .catch(error => {
                alert(`Failed to delete Spectrum with ID ${Spectrum.id}: ${error}`)
            });
    }

    const DeleteData = async () => {
        const response = await fetch('http://localhost:8888/Spectrums' + Spectrum.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 200) {
            reloadPage()
            return
        }
        throw new Error(`status code = ${response.status}`);
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
            {isServer && (
                <div className="circle" onClick={deleteClickHandler}>
                    <img
                        src="/deleteTrash.png"
                        alt="Del"
                        className="deleted-trash"
                    />
                </div>
            )}
            <div className="container-card" onClick={() => onClick(Spectrum.id)}>{Spectrum.name}</div>
        </div>
    );
};

export default SpectrumItem;
