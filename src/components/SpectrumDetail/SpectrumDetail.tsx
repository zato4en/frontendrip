import {FC, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import './SpectrumCard.css'
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchSpectrum} from "../../store/reducers/ActionCreator.ts";
import Cookies from "js-cookie";
import axios from "axios";
import {IDeleteSpectrumRequest} from "../../models/models.ts";
import spectrumTable from "../SpectrumTable/SpectrumTable.tsx";

interface SpectrumDetailProps {
    setPage: (name: string, id: number) => void
}

const SpectrumDetail: FC<SpectrumDetailProps> = ({setPage}) => {
    const params = useParams();
    const dispatch = useAppDispatch()
    const {Spectrum, isLoading, error} = useAppSelector(state => state.SpectrumReducer)
    const navigate = useNavigate();
    const role = Cookies.get('role')
    const accessToken = Cookies.get('jwtToken')

    const handleDelete = (spectrumid:number) => {
        navigate('/Spectrums');
        DeleteData(spectrumid)
            .then(() => {
                console.log(`Spectrum with ID ${Spectrum?.id} successfully deleted.`);
            })
            .catch(error => {
                console.error(`Failed to delete Spectrum with ID ${Spectrum?.id}: ${error}`);
                navigate('/Spectrums');
            });
    }

    const DeleteData = async (spectrumid:number) => {
        try {
            // const response = await fetch('http://localhost:8888/Spectrums', {
            //     method: 'DELETE',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     data:{
            //         id: id,
            //     },
            // });
            const response = await axios.delete(`/api/Spectrums`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                data: {
                    id: spectrumid,
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
        dispatch(fetchSpectrum(`${params.id}`, setPage))
    }, [params.id]);

    return (
        <>
            {isLoading && <h1> Загрузка данных .... </h1>}
            {error && <h1>Ошибка {error} </h1>}
            {<div className="Spectrum-card-body">
                <div className="card-container">
                    <span className="pro">Спектр</span>
                    <img
                        className="round"
                        src={Spectrum?.image_url}
                        alt={Spectrum?.name}
                    />
                    <h3>{Spectrum?.name}</h3>
                    {/*<h6>Статус: {Spectrum?.status}</h6>*/}
                    <p>{Spectrum?.description}</p>
                    {role == '2' &&
                        <img
                            className="delete-button"
                            src="/deleteTrash.png"
                            alt="Delete"
                            onClick={() => handleDelete(Spectrum.id)}
                        />
                    }
                    <div className="buttons">
                        <button className="primary" onClick={BackHandler}>Назад</button>
                    </div>
                </div>
            </div>}
        </>
    );
};

export default SpectrumDetail;
