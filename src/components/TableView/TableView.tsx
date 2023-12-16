import {FC} from "react";
import './TableView.css'
import {IDestinationSatellites} from "../../models/models.ts";
import {useAppDispatch} from "../../hooks/redux.ts";
import {deleteSatelliteById} from "../../store/reducers/ActionCreator.ts";
import {SpectrumSlice} from "../../store/reducers/SpectrumSlice.ts";

interface TableViewProps {
    status: number
    destSatellites: IDestinationSatellites[]
}

const TableView: FC<TableViewProps> = ({destSatellites, status}) => {
    const dispatch = useAppDispatch()
    const {minus} = SpectrumSlice.actions

    const handleDelete = (id: number) => {
        dispatch(minus())
        dispatch(deleteSatelliteById(id))
    }

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th className="number">Номер</th>
                    <th>Фотография</th>
                    <th>Название города</th>
                    <th>Описание</th>
                </tr>
                </thead>
                <tbody>
                {destSatellites.map((item, index) => (
                    <tr key={index}>
                        <td className="Spectrum-number-td">{item.serial_number}</td>
                        <td className="image-td">
                            <img src={item.Spectrum.image_url} alt="photo"/>
                        </td>
                        <td className="Spectrum-name-td">{item.Spectrum.name}</td>
                        <td>{item.Spectrum.description}</td>
                        {
                            status != 2 && <td className="delete-td">
                                <img
                                    className="delete-button-td"
                                    src="/dustbin.png"
                                    alt="Delete"
                                    onClick={() => handleDelete(item.id)}
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
