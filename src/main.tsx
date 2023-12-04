import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import SpectrumList from "./components/SpectrumsList/SpectrumList.tsx";
import SpectrumDetail from "./components/SpectrumDetail/SpectrumDetail.tsx";

const router = createBrowserRouter([
    {
        path: '/frontendrip',
        element: <SpectrumList/>
    },
    {
        path: '/frontendrip/spectrums',
        element: <SpectrumList/>
    },
    {
        path: '/frontendrip/spectrums/:id',
        element: <SpectrumDetail/>
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
)
