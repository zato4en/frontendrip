import {Routes, Route, Navigate} from 'react-router-dom';
import NavigationBar from "./components/NavigationBar.tsx";
import SpectrumsList from "./components/SpectrumsList/SpectrumsList.tsx";
import SpectrumDetail from "./components/SpectrumDetail/SpectrumDetail.tsx";
import {useState} from "react";
import BreadCrumbs, {IBreadCrumb} from "./components/BreadCrumbs/BreadCrumbs.tsx";


function App() {
    const spectrumsPage = {name: 'Спектры', to: 'spectrums'};
    const [searchValue, setSearchValue] = useState('')
    const [pages, setPage] = useState<IBreadCrumb[]>([spectrumsPage])
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
                                   setPage={() => addPage([spectrumsPage])}
                                   searchValue={searchValue}
                                   resetSearchValue={resetSearchValue}
                               />
                           }
                    />
                    <Route path="/Spectrum/:id" element={
                        <SpectrumDetail
                            setPage={(name, id) => addPage([
                                spectrumsPage, {name: `Спектр-${name}`, to: `spectrums/${id}`}
                            ])}
                        />}
                    />
                </Routes>
            </>
        </>
    )
}


export default App
