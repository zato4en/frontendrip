import {FC, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './SpectrumCard.css'
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchSpectrum} from "../../store/reducers/ActionCreator.ts";

interface SpectrumDetailProps {
    setPage: (name: string, id: number) => void
}

const SpectrumDetail: FC<SpectrumDetailProps> = ({setPage}) => {
    const params = useParams();
    const dispatch = useAppDispatch()
    const {Spectrum, isLoading, error} = useAppSelector(state => state.SpectrumReducer)
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
            const response = await fetch('http://localhost:8888/Spectrums/delete/' + Spectrum?.id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                console.log('Город успешно удален');
                window.location.reload();
            } else {
                console.error('Произошла ошибка при удалении города');
            }

        } catch (error) {
            console.error('Произошла ошибка сети', error);
        }
    }

    const BackHandler = () => {
        navigate('/Spectrums');
    }

    useEffect(() => {
        dispatch(fetchSpectrum(`${params.id}`, setPage))
    }, [params.id]);

    return (
        <>
            {isLoading && <h1> Загрузка данных .... </h1>}
            {error && <h1>Ошибка {error} </h1>}
            {<div className="Spectrum-card-body">
                <div className="card-container">
                    <span className="pro">Город</span>
                    <img
                        className="round"
                        src={Spectrum?.image_url}
                        alt={Spectrum?.name}
                    />
                    <h3>{Spectrum?.name}</h3>
                    <h6>Статус: {Spectrum?.status.status_name}</h6>
                    <p>{Spectrum?.description}</p>
                    <img
                        className="delete-button"
                        src="/deleteTrash.png"
                        alt="Delete"
                        onClick={handleDelete}
                    />
                    <div className="buttons">
                        <button className="primary" onClick={BackHandler}>Назад</button>
                        <button className="primary ghost">Записаться</button>
                    </div>
                </div>
            </div>}
        </>
    );
};

export default SpectrumDetail;