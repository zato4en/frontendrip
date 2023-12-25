import './RequestView.css';
import {FC, useEffect, useState} from "react";
import TableView from "../TableView/TableView.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {
    convertServerDateToInputFormat, deleteSatellite,
    emptyString,
    fetchSatellites,
    makeSatellite,
    updateSatellite
} from "../../store/reducers/ActionCreator.ts";
import {ISatellite} from "../../models/models.ts";
import MyComponent from "../Popup/Popover.tsx";
import LoadAnimation from "../Popup/MyLoaderComponent.tsx";
import {Link} from "react-router-dom";
import {satelliteSlice} from "../../store/reducers/SatelliteSlice.ts";

interface RequestViewProps {
    setPage: () => void;
}

const RequestView: FC<RequestViewProps> = ({setPage}) => {
    const dispatch = useAppDispatch();
    const {Satellite, isLoading, error, success} = useAppSelector(state => state.SatelliteReducer);
    const {isAuth} = useAppSelector(state => state.userReducer);
    const [startSatelliteDate, setStartSatelliteDate] = useState('');
    const [endSatelliteDate, setEndSatelliteDate] = useState('');
    const [leader, setLeader] = useState('$');
    const [description, setDescription] = useState('$');
    const [SatelliteName, setSatelliteName] = useState('$');

    useEffect(() => {
        setPage();
        dispatch(fetchSatellites());
    }, []);

    const handleDeleteSatellite = (id: number) => {
        dispatch(deleteSatellite(id))
    }

    const handleMakeRequest = (id:number) => {
        dispatch(makeSatellite(id))

    }

    const handleSave = (id: number, Satellite: ISatellite) => {
        dispatch(
            updateSatellite(
                id,
                description == '$' ? Satellite.description : description,
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
            {(!Satellite || Satellite.Satellites.length === 0) && <h1>Заявок нет</h1>}

            {Satellite &&
                Satellite.Satellites.map((singleSatellite, index) => (
                    <div key={index} className='card-block'>
                        <div className="card">
                            <h3>Статус: {singleSatellite.status}</h3>
                            <div className="info">
                                <div className="author-info">
                                    {/*<img src={singleSatellite.user.image_url} alt="Фото Автора" className="author-img"/>*/}
                                    <div>
                                        {/*<h4>{emptyString(singleSatellite.user.user_name, "Имя не задано")}</h4>*/}
                                        {/*<p>Профессия: {emptyString(singleSatellite.user.profession, 'Профессия не задана')}</p>*/}
                                        <p>@{emptyString(singleSatellite.user_login, 'Логин не задан')}</p>
                                    </div>
                                </div>

                                <div className="dates-info">
                                    <p>
                                        Начало работы:
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={startSatelliteDate || convertServerDateToInputFormat(singleSatellite.date_create)}
                                            onChange={(e) => setStartSatelliteDate(e.target.value)}
                                            disabled={singleSatellite.status_id == 2}
                                        />
                                    </p>
                                    <p>
                                        Конец работы:
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={endSatelliteDate || convertServerDateToInputFormat(singleSatellite.date_formation)}
                                            onChange={(e) => setEndSatelliteDate(e.target.value)}
                                            disabled={singleSatellite.status_id == 2}
                                        />
                                    </p>
                                    {/*<p>*/}
                                    {/*    Лидер похода:*/}
                                    {/*    <input*/}
                                    {/*        type="text"*/}
                                    {/*        className="form-control bg-black text-white"*/}
                                    {/*        value={leader == "$" ? singleSatellite.leader : leader}*/}
                                    {/*        onChange={(e) => setLeader(e.target.value)}*/}
                                    {/*        disabled={singleSatellite.status_id == 2}*/}
                                    {/*    />*/}
                                    {/*</p>*/}
                                </div>

                            </div>
                            <div className="detail-info">
                                <input
                                    type="text"
                                    className="form-control bg-black text-white"
                                    value={SatelliteName == "$" ? singleSatellite.satellite : SatelliteName}
                                    onChange={(e) => setSatelliteName(e.target.value)}
                                    style={{marginBottom: '20px'}}
                                    disabled={singleSatellite.status == "удален"}
                                />
                                <textarea
                                    className="form-control description-text-info bg-black text-white"
                                    style={{height: "200px"}}
                                    value={description == "$" ? singleSatellite.description : description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={singleSatellite.status_id == 2}
                                ></textarea>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                {singleSatellite.status_id != 2 && <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    onClick={() => handleSave(singleSatellite.id, singleSatellite)}
                                    style={{width: '150px', marginTop: '15px'}}
                                >
                                    Сохранить
                                </button>}
                            </div>
                        </div>
                        <TableView spectrum_requests={singleSatellite.spectrum_requests} status={singleSatellite.status}/>
                        {
                            singleSatellite.status_id != 2 && (
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
                                            onClick={() => handleMakeRequest(singleSatellite.id)}
                                        >
                                            Сформировать
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                ))}
        </>
    );
};

export default RequestView;