import {FC} from "react";
import './TableView.css'
import {IDestinationHikes} from "../../models/models.ts";
import {useAppDispatch} from "../../hooks/redux.ts";
import {deleteHikeById} from "../../store/reducers/ActionCreator.ts";
import {SpectrumSlice} from "../../store/reducers/SpectrumSlice.ts";

interface TableViewProps {
    status: number
    destHikes: IDestinationHikes[]
}

const TableView: FC<TableViewProps> = ({destHikes, status}) => {
    const dispatch = useAppDispatch()
    const {minus} = SpectrumSlice.actions

    const handleDelete = (id: number) => {
        dispatch(minus())
        dispatch(deleteHikeById(id))
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
                {destHikes.map((item, index) => (
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
