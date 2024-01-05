import {FC} from "react";
import './TableView.css'
import { ISpectrumRequests} from "../../models/models.ts";
import {useAppDispatch} from "../../hooks/redux.ts";
import {deleteSatelliteById} from "../../store/reducers/ActionCreator.ts";
import {SpectrumSlice} from "../../store/reducers/SpectrumSlice.ts";

interface TableViewProps {
    status: string
    spectrum_requests: ISpectrumRequests[]
}

const TableView: FC<TableViewProps> = ({spectrum_requests, status}) => {
    const dispatch = useAppDispatch()
    const {minus} = SpectrumSlice.actions

    const handleDelete = (spectrum_id: number,satellite_id:number) => {
        dispatch(minus())
        dispatch(deleteSatelliteById(spectrum_id,satellite_id))
        setTimeout(100)

    }

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th className="number">Номер</th>
                    <th>Фотография</th>
                    <th>Название спектра</th>
                    <th>Описание</th>
                </tr>
                </thead>
                <tbody>
                {spectrum_requests.map((item, index) => (
                    <tr key={index}>
                        <td className="Spectrum-number-td">{item.spectrum_id}</td>
                        <td className="image-td">
                            <img src={item.spectrum.image_url} alt="photo"/>
                        </td>
                        <td className="Spectrum-name-td">{item.spectrum.name}</td>
                        <td>{item.spectrum.description}</td>
                        {
                            status != "удален" && <td className="delete-td">
                                <img
                                    className="delete-button-td"
                                    src="/dustbin.png"
                                    alt="Delete"
                                    onClick={() => handleDelete(item.spectrum_id, item.satellite_id)}
                                />
                            </td>
                        }
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default TableView;