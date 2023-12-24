import {AppDispatch} from "../store.ts";
import axios from "axios";
import {
    IAuthResponse,
    ISpectrumResponse,
    ISpectrumWithBasket,
    IDeleteDestinationSatellite,
    ISatelliteResponse, IRegisterResponse,
    IRequest,
    mockSpectrums
} from "../../models/models.ts";
import Cookies from 'js-cookie';
import {SpectrumSlice} from "./SpectrumSlice.ts"
import {satelliteSlice} from "./SatelliteSlice.ts";
import {userSlice} from "./UserSlice.ts";


export const fetchSpectrums = (searchValue?: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(SpectrumSlice.actions.SpectrumsFetching())
        const response = await axios.get<ISpectrumWithBasket>('/api/Spectrums' + `?search=${searchValue ?? ''}`)
        dispatch(SpectrumSlice.actions.SpectrumsFetched(response.data.Spectrums))
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
        url: "/Satellites",
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

export const makeSatellite = () => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        url: "/Satellites/update/status-for-user",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            status_id: 2
        }
    }
    try {
        dispatch(satelliteSlice.actions.SatellitesFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка создана`
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

export const fetchSatellites = () => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(satelliteSlice.actions.SatellitesFetching())
        const response = await axios.get<ISatelliteResponse>(`/api/Satellites`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const transformedResponse: IRequest = {
            Satellites: response.data.Satellites,
            status: response.data.status
        };

        dispatch(satelliteSlice.actions.SatellitesFetched(transformedResponse))
    } catch (e) {
        dispatch(satelliteSlice.actions.SatellitesFetchedError(`${e}`))
    }
}

export const deleteSatelliteById = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(satelliteSlice.actions.SatellitesFetching())
        const response = await axios.delete<IDeleteDestinationSatellite>(`/api/destination-Satellites`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                id: id,
            },
        });
        dispatch(satelliteSlice.actions.SatellitesDeleteSuccess(response.data))
        dispatch(fetchSatellites())
    } catch (e) {
        dispatch(satelliteSlice.actions.SatellitesFetchedError(`${e}`))
    }
}

export const updateSatellite = (
    id: number,
    description: string,
    SatelliteName: string,
    startDate: string,
    endDate: string,
    leader: string
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "put",
        url: "/Satellites",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ContentType: "application/json"
        },
        data: {
            description: description,
            Satellite_name: SatelliteName,
            date_start_Satellite: convertInputFormatToServerDate(startDate),
            date_end: convertInputFormatToServerDate(endDate),
            leader: leader,
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
        const response = await axios.get<ISpectrumResponse>(`/api/Spectrums?Spectrum=${SpectrumId}`)
        const Spectrum = response.data.Spectrums
        setPage(Spectrum[0].name ?? "Без названия", Spectrum[0].id)
        dispatch(SpectrumSlice.actions.SpectrumFetched(Spectrum[0]))
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