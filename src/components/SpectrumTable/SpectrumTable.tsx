import SpectrumTableCell from './SpectrumTableCell.tsx';
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {FC, useEffect} from "react";
import {fetchSpectrums} from "../../store/reducers/ActionCreator.ts";
import LoadAnimation from "../Popup/MyLoaderComponent.tsx";
import MyComponent from "../Popup/Popover.tsx";
import {Link} from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import './SpectrumTable.css'

interface SpectrumTableProps {
    setPage: () => void
}

const SpectrumTable: FC<SpectrumTableProps> = ({setPage}) => {
    const dispatch = useAppDispatch()
    const {Spectrums, isLoading, error, success} = useAppSelector(state => state.SpectrumReducer)
    useEffect(() => {
        setPage()
        dispatch(fetchSpectrums())
    }, []);

    return (
        <>
            {isLoading && <LoadAnimation/>}
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <Nav className="ms-2">
                <Nav.Item>
                    <Link to="/add-Spectrum-2" className="btn btn-outline-primary mt-2"
                          style={{marginLeft: '80px', marginBottom: '30px'}}>
                        Добавить спектр
                    </Link>
                </Nav.Item>
            </Nav>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название спектра</th>
                    {/*<th>Статус</th>*/}
                    <th>Описание</th>
                    <th>Изображение</th>
                </tr>
                </thead>
                <tbody>
                {Spectrums.map(Spectrum => (
                    <SpectrumTableCell SpectrumData={Spectrum}/>
                ))
                }
                </tbody>
            </table>
        </>
    );
};

export default SpectrumTable;
