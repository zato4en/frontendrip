import {FC, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {ISpectrum, mockSpectrums} from '../../models/models.ts';
import './SpectrumCard.css'

const SpectrumDetail: FC = () => {
    const params = useParams();
    const [Spectrum, setSpectrum] = useState<ISpectrum | null>(null);
    const handleDelete = () => {
        console.log(`Tap! ${Spectrum?.id}`)
        // TODO: Удаление
    }

    useEffect(() => {
        fetchSpectrum().catch((err) => {
            console.error(err);
            const previewID = params.id !== undefined ? parseInt(params.id, 10) - 1 : 0;
            setSpectrum(mockSpectrums[previewID]);
            console.log(Spectrum);
        });
    }, [params.id]);

    async function fetchSpectrum() {
        try {
            const response = await fetch(`http://localhost:8888/Spectrum/${params.id}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            setSpectrum(data.Spectrums);
            console.log(data, data.Spectrums, Spectrum);
        } catch (error) {
            console.error('Error fetching Spectrum data', error);
            throw error;
        }
    }


    // if (!Spectrum) {
    //     return <div>Loading...</div>;
    // }

    return (

        !Spectrum
            ? <div>Loading...</div>
            :  <div className="city-card-body">
                <div className="card-external-container">
                    <span className="pro">Спектр</span>
                    <div className="card-container">
                        <img
                            className="square"
                            src={Spectrum?.image_url}
                            alt={Spectrum?.name}
                        />
                        <h3>{Spectrum?.name}</h3>

                        {/* <h6>Статус: {Spectrum?.status.status_name}</h6> */}
                        <p>{Spectrum?.description}</p>

                        <div className="buttons">
                            <button className="primary">Следить</button>
                            <button className="primary ghost">Записаться</button>
                        </div>
                    </div>
                    <img
                        className="delete-button"
                        src="http://localhost:8888/static/img/deleteTrash.png?v=1"
                        alt="Delete"
                        onClick={handleDelete}
                    />
                </div>
            </div>



    );
};

export default SpectrumDetail;
