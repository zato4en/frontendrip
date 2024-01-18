import {useState, ChangeEvent, FormEvent, FC, useEffect} from 'react';
import {Button, Form, Container, Row, Col} from 'react-bootstrap';
import {convertServerDateToInputFormat, createSpectrum} from "../../store/reducers/ActionCreator.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import MyComponent from "../Popup/Popover.tsx";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import {Simulate} from "react-dom/test-utils";
import waiting = Simulate.waiting;

interface SpectrumData {
    SpectrumName: string;
    description: string;
    image: File | null;
}

interface AddSpectrumProps {
    setPage: () => void
}

const CreateSpectrumPage: FC<AddSpectrumProps> = ({setPage}) => {
    const navigate = useNavigate();
    const [SpectrumData, setSpectrumData] = useState<SpectrumData>({
        SpectrumName: '',
        description: '',
        image: null,
    });
    const {error, success} = useAppSelector(state => state.SpectrumReducer)
    const role = Cookies.get('role')
    const dispatch = useAppDispatch()
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setSpectrumData({...SpectrumData, [name]: value});
    };

    useEffect(() => {
        setPage()
    }, []);

    const save = () => {
        dispatch(createSpectrum(SpectrumData.SpectrumName, SpectrumData.description, SpectrumData.image));

        setTimeout(() => {
            navigate(-1);
        }, 150);  // 250 миллисекунд = 0.25 секунды
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            SpectrumData.image = file
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Handle form submission logic, e.g., dispatching data to the server
        console.log('Spectrum data submitted:', SpectrumData);
    };

    if (role != '2') {
        console.log(role)
        return <h2>нет прав</h2>
    }
    return (
        <>
            {error != "" && <MyComponent isError={true} message={error}/>}
            {success != "" && <MyComponent isError={false} message={success}/>}

            <Container>
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6}>
                        <h2>Добаление спектра</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formSpectrumName">
                                <Form.Label>Название спектра</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Название"
                                    name="SpectrumName"
                                    value={SpectrumData.SpectrumName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formSpectrumDescription">
                                <Form.Label>Описание спектра</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Описание"
                                    name="description"
                                    value={SpectrumData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formSpectrumImage">
                                <Form.Label>Фотография спектра</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" style={{marginTop: '30px'}} onClick={save}>
                                Создать
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default CreateSpectrumPage;