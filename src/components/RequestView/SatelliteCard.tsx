import {FC, useEffect, useState} from 'react';
import {
    convertServerDateToInputFormat, DateFormat,
    deleteSatellite,
    emptyString, fetchSatelliteById,
    makeSatellite, moderatorUpdateStatus,
    updateSatellite
} from '../../store/reducers/ActionCreator';
import TableView from '../TableView/TableView.tsx';
import {ISatellite} from '../../models/models.ts';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import Cookies from "js-cookie";
import {useNavigate, useParams} from "react-router-dom";
import MyComponent from "../Popup/Popover.tsx";

interface SatelliteCardProps {
    setPage: (name: string, id: number) => void
}


const SatelliteCard: FC<SatelliteCardProps> = ({setPage}) => {
    const {Satellite_id} = useParams();
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const {singleSatellite, success, error} = useAppSelector(state => state.SatelliteReducer)
    const [startSatelliteDate, setStartSatelliteDate] = useState('');
    const [endSatelliteDate, setEndSatelliteDate] = useState('');
    const [leader, setLeader] = useState('$');
    const [description, setDescription] = useState('$');
    const [SatelliteName, setSatelliteName] = useState('$');
    const role = Cookies.get('role')

    useEffect(() => {
        if (Satellite_id) {
            dispatch(fetchSatelliteById(Satellite_id, setPage))
        }
    }, []);

    const handleDeleteSatellite = (id: number) => {
        dispatch(deleteSatellite(id))
        navigate(-1);
    }

    const handlerApprove = () => {
        if (singleSatellite) {
            dispatch(moderatorUpdateStatus(singleSatellite.id, 3))
            navigate(-1);
        }
    }

    const handleDiscard = () => {
        if (singleSatellite) {
            dispatch(moderatorUpdateStatus(singleSatellite.id, 4))
            navigate(-1);
        }
    }

    const handleMakeRequest = (id: number) => {
        dispatch(makeSatellite(id))

        navigate(-1);
    }

    const handleSave = (id: number, Satellite: ISatellite) => {
        dispatch(
            updateSatellite(
                id,
                SatelliteName == '$' ? Satellite.satellite : SatelliteName,

            )
        )
    }

    return (
        <>
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <div className='mx-5 mb-5'>
                {
                    singleSatellite && <>
                        {/* ======================= ШАПКА =============================== */}

                        <div className="card">
                            <h3>Статус: {singleSatellite.status}</h3>
                            <div className="info">
                                <div className="author-info">
                                    {/*<img src={singleSatellite.user} alt="Фото Автора" className="author-img"/>*/}
                                    <div>
                                        {/*<h4>{emptyString(singleSatellite.user.user_name, "Имя не задано")}</h4>*/}
                                        {/*<p>Профессия: {emptyString(singleSatellite.user, 'Профессия не задана')}</p>*/}
                                        <p>@{emptyString(singleSatellite.user_login, 'Логин на задан')}</p>
                                    </div>
                                </div>

                                <div className="dates-info">
                                    <p>
                                        Начало сканирования:
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={startSatelliteDate || convertServerDateToInputFormat(singleSatellite.date_formation)}
                                            onChange={(e) => setStartSatelliteDate(e.target.value)}
                                            disabled={singleSatellite.status != "черновик"}
                                        />
                                    </p>
                                    {/*<p>*/}
                                    {/*    Конец похода:*/}
                                    {/*    <input*/}
                                    {/*        type="date"*/}
                                    {/*        className="form-control"*/}
                                    {/*        value={endSatelliteDate || convertServerDateToInputFormat(singleSatellite.вф)}*/}
                                    {/*        onChange={(e) => setEndSatelliteDate(e.target.value)}*/}
                                    {/*        disabled={singleSatellite.status != "черновик"}*/}
                                    {/*    />*/}
                                    {/*</p>*/}
                                    {/*<p>*/}
                                    {/*    Лидер похода:*/}
                                    {/*    <input*/}
                                    {/*        type="text"*/}
                                    {/*        className="form-control bg-black text-white"*/}
                                    {/*        value={leader == "$" ? singleSatellite.leader : leader}*/}
                                    {/*        onChange={(e) => setLeader(e.target.value)}*/}
                                    {/*        disabled={singleSatellite.status != "черновик"}*/}
                                    {/*    />*/}
                                    {/*</p>*/}
                                </div>

                            </div>
                            <div className="detail-info">
                                <>Имя спутника</>
                                <input
                                    type="text"
                                    className="form-control bg-black text-white"
                                    value={SatelliteName == "$" ? singleSatellite.satellite : SatelliteName}
                                    onChange={(e) => setSatelliteName(e.target.value)}
                                    style={{marginBottom: '20px'}}
                                    disabled={singleSatellite.status == "в работе"}
                                />

                            </div>
                            <div style={{textAlign: 'right'}}>
                                {singleSatellite.status != "в работе" && <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    onClick={() => handleSave(singleSatellite.id, singleSatellite)}
                                    style={{width: '150px', marginTop: '15px'}}
                                >
                                    Сохранить
                                </button>}
                            </div>
                        </div>

                        {/* ======================= ТАБЛИЦА ============================= */}

                        <TableView
                            setPage={setPage}
                            SatelliteID={Satellite_id ?? ''}
                            spectrum_requests={singleSatellite.spectrum_requests}
                            status={singleSatellite.status}
                        />

                        {/* ======================= КНОПКИ ============================= */}

                        <div className='delete-make' style={{display: 'flex', gap: '10px'}}>
                            {singleSatellite.status != "удален"  && (
                                <div style={{flex: 1}}>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => handleDeleteSatellite(singleSatellite.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            )}

                            {singleSatellite.status == "черновик" && (
                                <div style={{flex: 1}}>
                                    <button
                                        type="button"
                                        className="btn btn-outline-light"
                                        onClick={() => handleMakeRequest(Satellite_id)}
                                    >
                                        Сформировать
                                    </button>
                                </div>
                            )}

                            {singleSatellite.status == "в работе" && role == '2' && (
                                <>
                                    <div style={{flex: 1}}>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger"
                                            onClick={() => handleDiscard()}
                                        >
                                            Отказать
                                        </button>
                                    </div>

                                    <div style={{flex: 1}}>
                                        <button
                                            type="button"
                                            className="btn btn-outline-light"
                                            onClick={handlerApprove}
                                        >
                                            Завершить
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                }
            </div>
        </>
    );
};

export default SatelliteCard;
