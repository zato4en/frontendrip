import {AppDispatch} from "../store.ts";
import axios from "axios";
import {
    IAuthResponse,
    ISpectrumResponse,
    ISpectrumWithBasket,
    IDeleteSpectrumRequest,
    ISatelliteResponse, IRegisterResponse,
    IRequest,
    mockSpectrums, ISatellite
} from "../../models/models.ts";
import Cookies from 'js-cookie';
import {SpectrumSlice} from "./SpectrumSlice.ts"
import {satelliteSlice} from "./SatelliteSlice.ts";
import {userSlice} from "./UserSlice.ts";


export const fetchSpectrums = (searchValue?: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    const config = {
        method: "get",
        url: `/api/Spectrums`+ `?search=${searchValue ?? ''}`,
        headers: {
            Authorization: `Bearer ${accessToken ?? ''}`,
        },
    }
    try {
        dispatch(SpectrumSlice.actions.SpectrumsFetching())
        const response = await axios<ISpectrumWithBasket>(config);
        dispatch(SpectrumSlice.actions.SpectrumsFetched([response.data.Spectrums,response.data.Satellite_id]))
    } catch (e) {
        dispatch(SpectrumSlice.actions.SpectrumsFetchedError(`Ошибка: ${e}`))
        dispatch(SpectrumSlice.actions.SpectrumsFetched(filterMockData(searchValue)))
    }
}

export const addSpectrumIntoSatellite = (SpectrumId: number, serialNumber: number, SpectrumName: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "post",
        url: "/api/SpectrumsRequests",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            Spectrum_id: SpectrumId,
            serial_number: serialNumber
        }
    }

    try {
        dispatch(SpectrumSlice.actions.SpectrumsFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        dispatch(fetchSpectrums())
        const successText = errorText || `Спектр "${SpectrumName}" добавлен`
        dispatch(SpectrumSlice.actions.SpectrumAddedIntoSatellite([errorText, successText]));
        setTimeout(() => {
            dispatch(SpectrumSlice.actions.SpectrumAddedIntoSatellite(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(SpectrumSlice.actions.SpectrumsFetchedError(`${e}`))
    }
}

export const deleteSatellite = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "delete",
        url: "/api/Satellites",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            id: id
        }
    }
    try {
        dispatch(satelliteSlice.actions.SatellitesFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка удалена`
        dispatch(satelliteSlice.actions.SatellitesUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchSatellites())
        }
        setTimeout(() => {
            dispatch(satelliteSlice.actions.SatellitesUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(satelliteSlice.actions.SatellitesDeleteError(`${e}`))
    }
}

export const makeSatellite = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        url: `/api/SatellitesUser/${id}`, // изменение здесь: id внесён в URL
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }
    try {
        dispatch(satelliteSlice.actions.SatellitesFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка создана`
        dispatch(satelliteSlice.actions.SatellitesUpdated([errorText, successText]));
        if (successText !== "") {
            dispatch(fetchSatellites())
        }
        setTimeout(() => {
            dispatch(satelliteSlice.actions.SatellitesUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(satelliteSlice.actions.SatellitesDeleteError(`${e}`))
    }
}

export const fetchSatellites = () => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(satelliteSlice.actions.SatellitesFetching())
        const response = await axios.get<IRequest>(`/api/Satellites`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const transformedResponse = response.data.Satellites;

        dispatch(satelliteSlice.actions.SatellitesFetched(transformedResponse))
    } catch (e) {
        dispatch(satelliteSlice.actions.SatellitesFetchedError(`${e}`))
    }
}

export const fetchSatelliteById = (
    id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    interface ISinglesatelliteResponse {
        Satellite: ISatellite,
    }

    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(satelliteSlice.actions.SatellitesFetching())

        const response = await axios.get<ISinglesatelliteResponse>(`/api/Satellites/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        setPage(response.data.Satellite.satellite, response.data.Satellite.id)

        dispatch(satelliteSlice.actions.SatelliteFetched(response.data.Satellite))

    } catch (e) {
        console.log("aboba")
        dispatch(satelliteSlice.actions.SatellitesFetchedError(`${e}`))
    }
}


export const deleteSatelliteById = (spectrum_id: number,satellite_id:number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(satelliteSlice.actions.SatellitesFetching())
        const response = await axios.delete<IDeleteSpectrumRequest>(`/api/SpectrumsRequests`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                spectrum_id: spectrum_id,
                satellite_id:satellite_id
            },
        });
        dispatch(satelliteSlice.actions.SatellitesDeleteSuccess(response.data))
        dispatch(fetchSatellites())
    } catch (e) {
        dispatch(satelliteSlice.actions.SatellitesFetchedError(`${e}`))
    }
}

// export const fetchSatelliteById = (
//     id: string,
//     setPage: (name: string, id: number) => void
// ) => async (dispatch: AppDispatch) => {
//     interface ISingleSatelliteResponse {
//         Satellite: ISatellite,
//     }
//
//     const accessToken = Cookies.get('jwtToken');
//     dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
//     try {
//         dispatch(satelliteSlice.actions.SatellitesFetching())
//         const response = await axios.get<ISingleSatelliteResponse>(`/api/v3/Satellites/${id}`, {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`
//             }
//         });
//         setPage(response.data.Satellite.satellite, response.data.Satellite.id)
//         dispatch(satelliteSlice.actions.SatellitesFetched(response.data.Satellite))
//     } catch (e) {
//         dispatch(satelliteSlice.actions.SatellitesFetchedError(`${e}`))
//     }
// }
export const updateSatellite = (
    id: number,
    satellite: string,
    // startDate: string,
    // endDate: string,
    // leader: string
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "put",
        url: "/api/Satellites",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ContentType: "application/json"
        },
        data: {
            satellite: satellite,
            // date_create: convertInputFormatToServerDate(startDate),
            // date_end: convertInputFormatToServerDate(endDate),
            // leader: leader,
            id: id,
        }
    };

    try {
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || "Успешно обновленно"
        dispatch(satelliteSlice.actions.SatellitesUpdated([errorText, successText]));
        setTimeout(() => {
            dispatch(satelliteSlice.actions.SatellitesUpdated(['', '']));
        }, 5000);
    } catch (e) {
        dispatch(satelliteSlice.actions.SatellitesFetchedError(`${e}`));
    }
}

export const fetchSpectrum = (
    SpectrumId: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    try {
        dispatch(SpectrumSlice.actions.SpectrumsFetching())
        const response = await axios.get<ISpectrumResponse>(`/api/Spectrums/${SpectrumId}`)
        const Spectrum = response.data.Spectrums
        setPage(Spectrum.name ?? "Без названия", Spectrum.id)
        dispatch(SpectrumSlice.actions.SpectrumFetched(Spectrum))
    } catch (e) {
        console.log(`Ошибка загрузки спектров: ${e}`)
        const previewID = SpectrumId !== undefined ? parseInt(SpectrumId, 10) - 1 : 0;
        const mockSpectrum = mockSpectrums[previewID]
        setPage(mockSpectrum.name ?? "Без названия", mockSpectrum.id)
        dispatch(SpectrumSlice.actions.SpectrumFetched(mockSpectrum))
    }
}

export const registerSession = (userName: string, login: string, password: string) => async (dispatch: AppDispatch) => {
    const config = {
        method: "post",
        url: "/api/signup",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            'user_name': userName,
            login: login,
            password: password,
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios<IRegisterResponse>(config);
        const errorText = response.data.login == '' ? 'Ошибка регистрации' : ''
        const successText = errorText || "Регистрация прошла успешно"
        dispatch(userSlice.actions.setStatuses([errorText, successText]))
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000)
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}

export const logoutSession = () => async (dispatch: AppDispatch) => {
    // Cookies.remove('jwtToken');
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "get",
        url: "/api/logout",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios(config);
        const errorText = response.data.login == '' ? 'Ошибка регистрации' : ''
        const successText = errorText || "Прощайте :("
        dispatch(userSlice.actions.setStatuses([errorText, successText]))

        if (errorText == '') {
            Cookies.remove('jwtToken');
            dispatch(userSlice.actions.setAuthStatus(false))
        }
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000)
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}


export const loginSession = (login: string, password: string) => async (dispatch: AppDispatch) => {
    const config = {
        method: "post",
        url: "/api/login",
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            login: login,
            password: password,
        }
    };

    try {
        dispatch(userSlice.actions.startProcess())
        const response = await axios<IAuthResponse>(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || "Авторизация прошла успешна"
        dispatch(userSlice.actions.setStatuses([errorText, successText]));
        const jwtToken = response.data.access_token
        if (jwtToken) {
            Cookies.set('jwtToken', jwtToken);
            dispatch(userSlice.actions.setAuthStatus(true));
        }
        setTimeout(() => {
            dispatch(userSlice.actions.resetStatuses());
        }, 6000);
    } catch (e) {
        dispatch(userSlice.actions.setError(`${e}`));
    }
}

// MARK: - Mock data

function filterMockData(searchValue?: string) {
    if (searchValue) {
        const filteredSpectrums = mockSpectrums.filter(Spectrum =>
            Spectrum.name?.toLowerCase().includes((searchValue ?? '').toLowerCase())
        );
        if (filteredSpectrums.length === 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            document.getElementById('search-text-field').value = ""
            alert("Данных нету")

        }
        return filteredSpectrums
    }
    return mockSpectrums
}

export function DateFormat(dateString: string) {
    if (dateString == "0001-01-01T00:00:00Z") {
        return "Дата не указана"
    }
    const date = new Date(dateString);
    return `${date.getDate()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`
}

export function emptyString(text: string, emptyText: string) {
    return text == "" ? emptyText : text
}

export const convertServerDateToInputFormat = (serverDate: string) => {
    const dateObject = new Date(serverDate);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

function convertInputFormatToServerDate(dateString: string): string {
    const dateRegex = /^4-2-2T2:2:2Z2:2/;
    if (dateRegex.test(dateString)) {
        return dateString;
    } else {
        const date = new Date(dateString);
        const isoDate = date.toISOString();
        return isoDate;
    }
}