import {FC, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {fetchSatellites, fetchSatellitesFilter} from "../../store/reducers/ActionCreator.ts";
import MyComponent from "../Popup/Popover.tsx";
import {Link} from "react-router-dom";
import "./DatePickerStyles.css";
import "./RequestView.css";
import {Dropdown, Form, Button, Container, Row, Col} from "react-bootstrap";
import {format} from "date-fns";
import {useNavigate} from 'react-router-dom';
import Cookies from "js-cookie";
import {ISatellite} from "../../models/models.ts";

interface RequestViewProps {
    setPage: () => void;
}

const RequestView: FC<RequestViewProps> = ({setPage}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {Satellite, error, success} = useAppSelector((state) => state.SatelliteReducer);
    const {isAuth} = useAppSelector((state) => state.userReducer);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const role = Cookies.get('role')
    const [filteredSatellites, setFilteredSatellites] = useState<ISatellite[] | null>(null);
    const [filteredByUsers, setFilteredUsers] = useState<ISatellite[] | null>(null);
    const [textValue, setTextValue] = useState<string>('');

    useEffect(() => {
        setPage();
        dispatch(fetchSatellites());

        const handleFilterInterval = setInterval(() => {
            handleFilter();
        }, 3000);

        const cleanup = () => {
            clearInterval(handleFilterInterval);
        };

        window.addEventListener('beforeunload', cleanup);

        return () => {
            cleanup();
            window.removeEventListener('beforeunload', cleanup);
        };
    }, [startDate, endDate, selectedStatus]);

    const resetFilter = () => {
        setStartDate(null)
        setEndDate(null)
        setSelectedStatus('')
    }

    const handleFilter = () => {
        const formatDate = (date: Date | null | undefined): string | undefined => {
            if (!date) {
                return undefined;
            }
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);
        if (role == '2') {
            dispatch(fetchSatellitesFilter(formattedStartDate, formattedEndDate, `${selectedStatus}`));
        } else {
            localFilter(formattedStartDate, formattedEndDate)
        }
    };

    function formatDate2(inputDate: string): string {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const formattedDate = `${year}-${month}-${day}`
        return formattedDate
    }

    const localFilter = (startDateString: string | undefined, endDateString: string | undefined) => {

        function isDateInRange(date: string): boolean {
            const bdDateString = formatDate2(date)
            const bdDate = new Date(bdDateString)
            const start = startDateString ? new Date(startDateString) : new Date('0001-01-01')
            const end = endDateString ? new Date(endDateString) : new Date('2033-12-21')
            return (!startDate || bdDate >= start) && (!endDate || bdDate <= end)
        }

        if (Satellite) {
            const d = Satellite.Satellites.filter(obj => isDateInRange(obj.date_create))
            setFilteredSatellites(d)
        }
    }

    const clickCell = (cellID: number) => {
        navigate(`/Satellites/${cellID}`);
    }

    if (!isAuth) {
        return (
            <Link to="/login" className="btn btn-outline-danger">
                Требуется войти в систему
            </Link>
        );
    }

    const handleInputChange = () => {
        if (Satellite) {
            const d = Satellite.Satellites.filter(obj => obj.user_login == textValue)
            setFilteredUsers(d.length == 0 ? null : d)
        }
    };

    return (
        <>
            <div className="d-flex justify-content-end mt-3 pe-4 mx-5">
                <div className="filter-section">

                    {role && (
                        <>
                            {role === '2' &&
                                <Form.Group controlId="exampleForm.ControlInput1" className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Введите пользователя"
                                        value={textValue}
                                        onChange={(e) => setTextValue(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleInputChange();
                                            }
                                        }}
                                        style={{width: '200px'}}
                                    />
                                </Form.Group>
                            }

                            <label>Дата создания:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className="custom-datepicker mb-2"
                                popperPlacement="bottom-start"
                            />

                            <label>Дата окончания:</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                className="custom-datepicker mb-2"
                                popperPlacement="bottom-start"
                            />

                            {role === '2' && (
                                <>
                                    <label>Статус заявки:</label>
                                    <Form.Select
                                        className="mb-2"
                                        style={{width: '170px'}}
                                        value={selectedStatus || ""}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    >
                                        <option value="">Выберите статус</option>
                                        <option value="2">Сформирован</option>
                                        <option value="3">Завершён</option>
                                        <option value="4">Отклонён</option>
                                    </Form.Select>
                                </>
                            )}

                            <Button
                                style={{width: '120px'}}
                                className="mb-2"
                                onClick={handleFilter}
                            >
                                Применить
                            </Button>
                            <Button
                                variant="outline-danger"
                                style={{width: '120px'}}
                                className="mb-2"
                                onClick={resetFilter}
                            >
                                Сбросить
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* =================================== TABLE ADMIN =============================================*/}
            {Satellite &&
                <table className='table-Satellites'>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название спутника</th>
                        <th>Дата создания</th>
                        <th>Дата формирования</th>
                        <th>Процент сканирования</th>
                        {role == '2' &&
                            <th>Модератор</th>
                        }
                        {role == '2' &&
                            <th>Логин пользователя</th>
                        }

                        <th>Статус</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredSatellites && role == '0'
                        ? filteredSatellites.map((Satellite) => (
                            <tr key={Satellite.id} onClick={() => clickCell(Satellite.id)}>
                                <td>{Satellite.id}</td>
                                <td>{Satellite.satellite || 'Не задано'}</td>
                                <td>{checkData(Satellite.date_create)}</td>
                                <td>{checkData(Satellite.date_formation)}</td>
                                {/*<td>{checkData(Satellite.date_end)}</td>*/}
                                {/*<td>{checkData(Satellite.date_start_of_processing)}</td>*/}
                                {/*<td>{checkData(Satellite.date_approve)}</td>*/}
                                {/*<td>{checkData(Satellite.date_start_Satellite)}</td>*/}
                                <td>{Satellite.percentage || 'Сканирование не началось'}</td>
                                <td>{Satellite.status}</td>
                            </tr>
                        ))
                        : (filteredByUsers ? filteredByUsers : Satellite.Satellites).map((Satellite) => (
                            <tr key={Satellite.id} onClick={() => clickCell(Satellite.id)}>
                                <td>{Satellite.id}</td>
                                <td>{Satellite.satellite || 'Не задано'}</td>
                                <td>{checkData(Satellite.date_create)}</td>
                                <td>{checkData(Satellite.date_formation)}</td>

                                {/*<td>{checkData(Satellite.date_approve)}</td>*/}
                                {/*<td>{checkData(Satellite.date_start_Satellite)}</td>*/}
                                <td>{Satellite.percentage || 'Сканирование не началось'}</td>
                                <td>{Satellite.status}</td>

                                {/*<td>{checkData(Satellite.date_approve)}</td>*/}
                                {/*<td>{checkData(Satellite.date_start_Satellite)}</td>*/}

                                {role == '2' &&
                                    <td>{Satellite.moder_login || 'Не задан'}</td>
                                }
                                {role == '2' &&
                                    <td>{Satellite.status}</td>
                                }

                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </>
    );
};

export default RequestView;

function checkData(data: string): string {
    if (data == '0001-01-01T00:00:00Z') {
        return 'Дата не задана'
    }
    const formattedDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'dd.MM.yyyy');
    };

    const formatted = formattedDate(data);
    return formatted
}
