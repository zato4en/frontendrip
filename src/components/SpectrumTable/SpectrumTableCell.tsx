import React, {FC, useState} from 'react';
import {Button, Form, Col} from 'react-bootstrap';
import {ISpectrum} from "../../models/models.ts";
import {deleteSpectrum, updateSpectrumImage, updateSpectrumInfo} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch} from "../../hooks/redux.ts";

interface SpectrumTableCellProps {
    SpectrumData: ISpectrum
}

const SpectrumTableCell: FC<SpectrumTableCellProps> = ({SpectrumData}) => {
    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(SpectrumData.name ?? "");
    const [description, setDescription] = useState(SpectrumData.description ?? "");
    const [status, setStatus] = useState(SpectrumData.status);
    const [statusId, setStatusId] = useState(`${SpectrumData.status}`);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleDeleteClick = () => {
        dispatch(deleteSpectrum(SpectrumData.id))
    }

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        dispatch(updateSpectrumInfo(SpectrumData.id, name, description, statusId))
        if (imageFile) {
            dispatch(updateSpectrumImage(SpectrumData.id, imageFile))
        }
        setIsEditing(false);
    };

    const handleInputChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setDescription(value)
    }

    const handleInputChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        setName(value)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {value} = e.target;
        setStatus(value)
        setStatusId(value)
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    if (isEditing) {
        return <td colSpan={6}>
            <div>
                <Form className='mx-5'>
                    <Form.Group as={Col} controlId="formSpectrumName" className='mt-2'>
                        <Form.Label>Название города</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите название города"
                            name="name"
                            value={name}
                            onChange={handleInputChangeName}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formSpectrumStatus" className='mt-2'>
                        <Form.Label>Статус</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={status}
                            onChange={handleInputChange}
                        >
                            <option value="1">Существует</option>
                            <option value="2">Уничтожен</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formSpectrumDescription" className='mt-2'>
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Введите описание города"
                            name="description"
                            value={description}
                            onChange={handleInputChangeDescription}
                        />
                    </Form.Group>

                    <Form.Group controlId="formSpectrumImage" className='mt-2'>
                        <Form.Label>Картинка</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </Form.Group>

                    <div style={{display: 'flex', justifyContent: 'space-between'}} className='my-3'>
                        <Button variant="primary" onClick={handleSaveClick}>
                            Сохранить изменения
                        </Button>

                        <Button variant='outline-light' onClick={() => {
                            setIsEditing(false)
                        }}>
                            Отменить редактирование
                        </Button>
                    </div>
                </Form>
            </div>
        </td>
    }

    return (
        <>
            <tr key={SpectrumData.id}>
                <td>{SpectrumData.id}</td>
                <td>{SpectrumData.name}</td>
                <td>{SpectrumData.status}</td>
                <td>{SpectrumData.description}</td>
                <td>{SpectrumData.image_url &&
                    <img src={SpectrumData.image_url}
                         alt="Spectrum Image"
                         className="img-thumbnail"
                         style={{width: '200px'}}/>
                }</td>
                <div className='my-3' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Button variant="outline-warning" onClick={handleEditClick} className='mb-2'>
                        Редактировать
                    </Button>

                    <Button variant="outline-danger" onClick={handleDeleteClick} style={{width: '100%'}}>
                        Удалить
                    </Button>
                </div>
            </tr>
        </>
    )
};

export default SpectrumTableCell;
