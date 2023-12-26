import {Routes, Route} from 'react-router-dom';
import NavigationBar from "./components/NavigationBar/NavigationBar.tsx";
import SpectrumList from "./components/SpectrumsList/SpectrumList.tsx";
import SpectrumDetail from "./components/SpectrumDetail/SpectrumDetail.tsx";
import {useState} from "react";
import BreadCrumbs, {Breadcrumb} from "./components/BreadCrumbs/BreadCrumbs.tsx";
import RequestView from "./components/RequestView/RequestView.tsx";
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import RegisterPage from "./components/RegisterPage/RegisterPage.tsx";
import SpectrumTable from "./components/SpectrumTable/SpectrumTable.tsx";
import CreateSpectrumPage from "./components/TableView/AddSpectrum.tsx";
import SatelliteCard from "./components/RequestView/SatelliteCard.tsx";
import Menu from "./components/Menu/Menu.tsx";

function App() {
    const homePage: Breadcrumb = {name: 'Главная', to: ''};
    const addSpectrumPage: Breadcrumb = {name: 'Создание спектра', to: 'add-spectrum'};
    const SpectrumsTablePage: Breadcrumb = {name: 'Таблица спектров', to: 'Spectrums/admin'};
    const SpectrumsPage: Breadcrumb = {name: 'Спектры', to: 'Spectrums'};
    const requestPage: Breadcrumb = {name: 'Заявки', to: 'request'};
    const [pages, setPage] = useState<Breadcrumb[]>([SpectrumsPage])
    const addPage = (newPage: Breadcrumb[]) => {
        setPage(newPage);
    };

    return (
        <>
            <NavigationBar/>
            <BreadCrumbs paths={pages}/>
            <>
                <Routes>

                    <Route path="/" element={
                        <Menu
                            setPage={() => addPage([homePage])}
                        />
                    }/>

                    <Route path="/Spectrums" element={
                        <SpectrumList
                            setPage={() => addPage([homePage, SpectrumsPage])}
                        />
                    }
                    />

                    <Route path="/request" element={
                        <RequestView
                            setPage={() => addPage([homePage, requestPage])}
                        />
                    }
                    />

                    <Route path="/add-Spectrum" element={
                        <CreateSpectrumPage
                            setPage={() => addPage([homePage, addSpectrumPage])}
                        />}
                    />

                    <Route path="/add-Spectrum-2" element={
                        <CreateSpectrumPage
                            setPage={() => addPage([homePage, SpectrumsTablePage, addSpectrumPage])}
                        />}
                    />

                    <Route path="/login" element={<LoginPage/>}/>

                    <Route path="/Spectrums/admin" element={
                        <SpectrumTable
                            setPage={() => addPage([homePage, SpectrumsTablePage])}
                        />}
                    />

                    <Route path="/register" element={<RegisterPage/>}/>

                    <Route path="/Satellites/:Satellite_id" element={
                        <SatelliteCard setPage={
                            (name, id) => addPage([
                                homePage,
                                requestPage,
                                {name: `Заявка: "${name}"`, to: `Satellite/${id}`}
                            ])
                        }/>
                    }/>

                    <Route path="/Spectrums/:id" element={
                        <SpectrumDetail
                            setPage={(name, id) => addPage([
                                homePage,
                                SpectrumsPage,
                                {name: `${name}`, to: `Spectrums/${id}`}
                            ])}
                        />}
                    />
                </Routes>
            </>
        </>
    )
}


export default App
