import {FC, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {ISpectrum, mockSpectrums} from '../../models/models.ts';
import './SpectrumCard.css'

interface SpectrumDetailProps {
    setPage: (name: string, id: number) => void
}

const SpectrumDetail: FC<SpectrumDetailProps> = ({setPage}) => {
    const params = useParams();
    const [Spectrum, setSpectrum] = useState<ISpectrum | null>(null);
    const navigate = useNavigate();

    const handleDelete = () => {
        navigate('/Spectrums');
        DeleteData()
            .then(() => {
                console.log(`Spectrum with ID ${Spectrum?.id} successfully deleted.`);
            })
            .catch(error => {
                console.error(`Failed to delete Spectrum with ID ${Spectrum?.id}: ${error}`);
                navigate('/Spectrums');
            });
    }

    const DeleteData = async () => {
        try {
            const response = await fetch('http://localhost:8888/Spectrums' , {
                method: 'DELETE',
                headers: {
                    // Сделать чтобы в джейсоне передавался айди  Spectrum?.id
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                console.log('Спектр успешно удален');
                window.location.reload();
            } else {
                console.error('Произошла ошибка при удалении спектра');
            }

        } catch (error) {
            console.error('Произошла ошибка сети', error);
        }
    }

    const BackHandler = () => {
        navigate('/Spectrums');
    }

    useEffect(() => {
        fetchSpectrum()
            .catch((err) => {
                console.error(err);
                const previewID = params.id !== undefined ? parseInt(params.id, 10) - 1 : 0;
                const mockSpectrum = mockSpectrums[previewID]
                if (mockSpectrum) {
                    setPage(mockSpectrum.name ?? "Без названия", mockSpectrum.id)
                }
                setSpectrum(mockSpectrum);
            });

    }, [params.id]);

    async function fetchSpectrum() {
        try {
            const response = await fetch(`/api/Spectrums/${params.id}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // Исправление здесь:
            // if (data && data.Spectrums) {
                setPage(data.Spectrums.name ?? "Без названия", data.Spectrums.id);
                setSpectrum(data.Spectrums);
            // } else {
                // Сюда попадаем, если поле Spectrums отсутствует в ответе
                // console.error("Проблема в структуре ответа API: отсутствует поле 'Spectrums'.", data);
            // }
        } catch (error) {
            console.error('Error fetching Spectrum data', error);
            throw error;
        }
    }


    if (!Spectrum) {
        return <div>Loading...</div>;
    }

    return (
        !Spectrum
            ? <div>Loading...</div>
            : <div className="Spectrum-card-body">
                <div className="card-container">
                    <span className="pro">Спектр</span>

                    <img
                        className="round"
                        src={Spectrum.image_url || "https://i.postimg.cc/B6pNb23x/relict.jpg"}
                        alt="Image"
                        onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // предотвращаем бесконечный цикл в случае ошибки с локальным изображением
                            currentTarget.src = "https://i.postimg.cc/B6pNb23x/relict.jpg"; // ваше локальное изображение-запасной вариант
                        }}

                        id={`photo-${Spectrum.id}`}
                    />
                    <h3>{Spectrum?.name}</h3>
                    {/*<h6>Статус: {Spectrum?.status.status_name}</h6>*/}
                    <p>{Spectrum?.description}</p>
                    <img
                        className="delete-button"
                        src="/deleteTrash.png"
                        alt="Delete"
                        onClick={handleDelete}
                    />
                    <div className="buttons">
                        <button className="primary" onClick={BackHandler}>Назад</button>
                        <button className="primary ghost">Оставить заявку</button>
                    </div>
                </div>
            </div>
    );
};

export default SpectrumDetail;
