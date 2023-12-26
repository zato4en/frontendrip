
import {FC, useEffect, useState} from "react";
import TableView from "../TableView/TableView.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {
    convertServerDateToInputFormat,
    emptyString, fetchSatelliteById,
    makeSatellite,
    updateSatellite
} from "../../store/reducers/ActionCreator.ts";
import {ISatellite} from "../../models/models.ts";
import MyComponent from "../Popup/Popover.tsx";
import LoadAnimation from "../Popup/MyLoaderComponent.tsx";

import {Link, useNavigate, useParams} from "react-router-dom";


interface SatelliteCardProps {
    setPage: (name: string, id: number) => void
}

const SatelliteCard: FC<SatelliteCardProps> = ({setPage}) => {
    const {satellite_id} = useParams();
    const dispatch = useAppDispatch();
    const {Satellite, isLoading, error, success} = useAppSelector(state => state.SatelliteReducer);
    const {isAuth} = useAppSelector(state => state.userReducer);
    const [startSatelliteDate, setStartSatelliteDate] = useState('');
    const [endSatelliteDate, setEndSatelliteDate] = useState('');
    const navigate = useNavigate()
    const [SatelliteName, setSatelliteName] = useState('$');

    useEffect(() => {
        if(satellite_id) {
            console.log("13123123")
            dispatch(fetchSatelliteById(satellite_id, setPage));
        }
    }, []);





    const handleMakeRequest = (id:number) => {
        dispatch(makeSatellite(id))
        navigate(-1)
    }

    const handleSave = (id: number, Satellite: ISatellite) => {
        dispatch(
            updateSatellite(
                id,

                SatelliteName == '$' ? Satellite.satellite : SatelliteName,
                // startSatelliteDate == "" ? Satellite.date_create : startSatelliteDate,
                // endSatelliteDate == "" ? Satellite.da : endSatelliteDate,
                // leader == '$' ? Satellite.leader : leader
            )
        )
    }

    if (!isAuth) {
        return <Link to="/login" className="btn btn-outline-danger">
            Требуется войти в систему
        </Link>
    }


    return (

        <>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}
            {(!Satellite) && <h1>Заявок нет</h1>}



            {Satellite &&
                    <div className='card-block'>
                        <div className="card">
                            <h3>Статус заявки: {Satellite.status}</h3>
                            <div className="info">
                                <div className="author-info">
                                    <div>
                                        <p>@{emptyString("Логин пользователя:  " + Satellite.user_login, 'Логин не задан')}</p>
                                    </div>
                                </div>

                                <div className="dates-info">
                                    <p>
                                        Дата создания:
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={startSatelliteDate || convertServerDateToInputFormat(Satellite.date_create)}
                                            onChange={(e) => setStartSatelliteDate(e.target.value)}
                                            disabled={Satellite.status != "в работе"}
                                        />
                                    </p>
                                    <p>
                                        Дата формирования:
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={endSatelliteDate || convertServerDateToInputFormat(Satellite.date_formation)}
                                            onChange={(e) => setEndSatelliteDate(e.target.value)}
                                            disabled={Satellite.status != "в работе"}
                                        />
                                    </p>

                                </div>

                            </div>
                            <div className="detail-info">
                                <>Имя спутника</>
                                <input
                                    type="text"
                                    className="form-control bg-black text-white"
                                    value={SatelliteName == "$" ? Satellite.satellite : SatelliteName}
                                    onChange={(e) => setSatelliteName(e.target.value)}
                                    style={{marginBottom: '20px'}}
                                    disabled={Satellite.status == "в работе"}
                                />

                            </div>
                            <div style={{textAlign: 'right'}}>
                                {Satellite.status != "в работе" && <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    onClick={() => handleSave(Satellite.id, Satellite)}
                                    style={{width: '150px', marginTop: '15px'}}
                                >
                                    Сохранить
                                </button>}
                            </div>
                        </div>
                        <TableView spectrum_requests={Satellite.spectrum_requests} status={Satellite.status}/>
                        {
                            Satellite.status != "в работе" && (
                                <div className='delete-make'>
                                    <div style={{textAlign: 'left', flex: 1}}>
                                        {/*<button*/}
                                        {/*    type="button"*/}
                                        {/*    className="btn btn-outline-danger"*/}
                                        {/*    onClick={() => handleDeleteSatellite(singleSatellite.id)}*/}
                                        {/*>*/}
                                        {/*    Удалить*/}
                                        {/*</button>*/}
                                    </div>
                                    <div style={{textAlign: 'right', flex: 1}}>
                                        <button
                                            type="button"
                                            className="btn btn-outline-light"
                                            onClick={() => handleMakeRequest(Satellite.id)}
                                        >
                                            Сформировать
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                }
        </>
    );
};


export default SatelliteCard;


