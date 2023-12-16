import {AppDispatch} from "../store.ts";
import axios from "axios";
import {
    IAuthResponse,
    ISpectrumResponse,
    ISpectrumWithBasket,
    IDeleteDestinationHike,
    IHikeResponse, IRegisterResponse,
    IRequest,
    mockSpectrums
} from "../../models/models.ts";
import Cookies from 'js-cookie';
import {SpectrumSlice} from "./SpectrumSlice.ts"
import {hikeSlice} from "./HikeSlice.ts";
import {userSlice} from "./UserSlice.ts";


export const fetchSpectrums = (searchValue?: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(SpectrumSlice.actions.SpectrumsFetching())
        const response = await axios.get<ISpectrumWithBasket>('/Spectrums' + `?search=${searchValue ?? ''}`)
        dispatch(SpectrumSlice.actions.SpectrumsFetched(response.data.Spectrums))
    } catch (e) {
        dispatch(SpectrumSlice.actions.SpectrumsFetchedError(`Ошибка: ${e}`))
        dispatch(SpectrumSlice.actions.SpectrumsFetched(filterMockData(searchValue)))
    }
}

export const addSpectrumIntoHike = (SpectrumId: number, serialNumber: number, SpectrumName: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "post",
        url: "/Spectrums/add-Spectrum-into-hike",
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
        dispatch(SpectrumSlice.actions.SpectrumAddedIntoHike([errorText, successText]));
        setTimeout(() => {
            dispatch(SpectrumSlice.actions.SpectrumAddedIntoHike(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(SpectrumSlice.actions.SpectrumsFetchedError(`${e}`))
    }
}

export const deleteHike = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "delete",
        url: "/hikes",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            id: id
        }
    }
    try {
        dispatch(hikeSlice.actions.hikesFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка удалена`
        dispatch(hikeSlice.actions.hikesUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchHikes())
        }
        setTimeout(() => {
            dispatch(hikeSlice.actions.hikesUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(hikeSlice.actions.hikesDeleteError(`${e}`))
    }
}

export const makeHike = () => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        url: "/hikes/update/status-for-user",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            status_id: 2
        }
    }
    try {
        dispatch(hikeSlice.actions.hikesFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка создана`
        dispatch(hikeSlice.actions.hikesUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchHikes())
        }
        setTimeout(() => {
            dispatch(hikeSlice.actions.hikesUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(hikeSlice.actions.hikesDeleteError(`${e}`))
    }
}

export const fetchHikes = () => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(hikeSlice.actions.hikesFetching())
        const response = await axios.get<IHikeResponse>(`/hikes`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const transformedResponse: IRequest = {
            hikes: response.data.hikes,
            status: response.data.status
        };

        dispatch(hikeSlice.actions.hikesFetched(transformedResponse))
    } catch (e) {
        dispatch(hikeSlice.actions.hikesFetchedError(`${e}`))
    }
}

export const deleteHikeById = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(hikeSlice.actions.hikesFetching())
        const response = await axios.delete<IDeleteDestinationHike>(`/destination-hikes`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                id: id,
            },
        });
        dispatch(hikeSlice.actions.hikesDeleteSuccess(response.data))
        dispatch(fetchHikes())
    } catch (e) {
        dispatch(hikeSlice.actions.hikesFetchedError(`${e}`))
    }
}

export const updateHike = (
    id: number,
    description: string,
    hikeName: string,
    startDate: string,
    endDate: string,
    leader: string
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    const config = {
        method: "put",
        url: "/hikes",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ContentType: "application/json"
        },
        data: {
            description: description,
            hike_name: hikeName,
            date_start_hike: convertInputFormatToServerDate(startDate),
            date_end: convertInputFormatToServerDate(endDate),
            leader: leader,
            id: id,
        }
    };

    try {
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || "Успешно обновленно"
        dispatch(hikeSlice.actions.hikesUpdated([errorText, successText]));
        setTimeout(() => {
            dispatch(hikeSlice.actions.hikesUpdated(['', '']));
        }, 5000);
    } catch (e) {
        dispatch(hikeSlice.actions.hikesFetchedError(`${e}`));
    }
}

export const fetchSpectrum = (
    SpectrumId: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    try {
        dispatch(SpectrumSlice.actions.SpectrumsFetching())
        const response = await axios.get<ISpectrumResponse>(`/Spectrums?search=${SpectrumId}`)
        const Spectrum = response.data.spectrum
        setPage(Spectrum.name ?? "Без названия", Spectrum.id)
        dispatch(SpectrumSlice.actions.SpectrumFetched(Spectrum))
    } catch (e) {
        console.log(`Ошибка загрузки городов: ${e}`)
        const previewID = SpectrumId !== undefined ? parseInt(SpectrumId, 10) - 1 : 0;
        const mockSpectrum = mockSpectrums[previewID]
        setPage(mockSpectrum.name ?? "Без названия", mockSpectrum.id)
        dispatch(SpectrumSlice.actions.SpectrumFetched(mockSpectrum))
    }
}

export const registerSession = (userName: string, login: string, password: string) => async (dispatch: AppDispatch) => {
    const config = {
        method: "post",
        url: "/users/sign_up",
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
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "get",
        url: "/users/logout",
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
        url: "/users/login",
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