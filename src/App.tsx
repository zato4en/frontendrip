import {Routes, Route, Navigate} from 'react-router-dom';
import NavigationBar from "./components/NavigationBar.tsx";
import SpectrumsList from "./components/SpectrumsList/SpectrumsList.tsx";
import SpectrumDetail from "./components/SpectrumDetail/SpectrumDetail.tsx";
import {useState} from "react";
import BreadCrumbs, {IBreadCrumb} from "./components/BreadCrumbs/BreadCrumbs.tsx";
import RequestView from "./components/RequestView/RequestView.tsx";
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import RegisterPage from "./components/RegisterPage/RegisterPage.tsx";

function App() {
    const SpectrumsPage = {name: 'Спектра', to: 'Spectrums'};
    const requestPage = {name: 'Заявка', to: 'request'};
    const [searchValue, setSearchValue] = useState('')
    const [pages, setPage] = useState<IBreadCrumb[]>([SpectrumsPage])
    const addPage = (newPage: IBreadCrumb[]) => {
        setPage(newPage);
    };
    const resetSearchValue = () => {
        setSearchValue('');
    };

    return (
        <>
            <NavigationBar handleSearchValue={(value) => setSearchValue(value)}/>
            <BreadCrumbs pages={pages}/>
            <>
                <Routes>
                    <Route path="/" element={<Navigate to="Spectrums"/>}/>
                    <Route path="/Spectrums"
                           element={
                               <SpectrumsList
                                   setPage={() => addPage([SpectrumsPage])}
                                   searchValue={searchValue}
                                   resetSearchValue={resetSearchValue}
                               />
                           }
                    />
                    <Route path="/request"
                           element={
                               <RequestView
                                   setPage={() => addPage([requestPage])}
                               />
                           }
                    />
                    <Route path="/login"
                           element={
                               <LoginPage/>
                           }
                    />
                    <Route path="/register"
                           element={
                               <RegisterPage/>
                           }
                    />
                    <Route path="/Spectrums/:id" element={
                        <SpectrumDetail
                            setPage={(name, id) => addPage([
                                SpectrumsPage, {name: `Спектр-${name}`, to: `Spectrums/${id}`}
                            ])}
                        />}
                    />
                </Routes>
            </>
        </>
    )
}


export default App