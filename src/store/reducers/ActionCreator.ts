import {AppDispatch} from "../store.ts";
import axios from "axios";
import {
    IAuthResponse,
    ISpectrumResponse,
    ISpectrumWithBasket, IDefaultResponse,
    IDeleteSpectrumRequest, ISatellite,
    ISatelliteResponse, IRegisterResponse,
    IRequest,
    mockSpectrums, ISpectrum
} from "../../models/models.ts";
import Cookies from 'js-cookie';
import {SpectrumSlice} from "./SpectrumSlice.ts"
import {SatelliteSlice} from "./SatelliteSlice.ts";
import {userSlice} from "./UserSlice.ts";


export const fetchSpectrums = (searchValue?: string, makeLoading: boolean = true) => async (dispatch: AppDispatch) => {
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
        if (makeLoading) {
            dispatch(SpectrumSlice.actions.SpectrumsFetching())
        }
        const response = await axios<ISpectrumWithBasket>(config);
        dispatch(SpectrumSlice.actions.SpectrumsFetched([response.data.Spectrums, response.data.Satellite_id]))
    } catch (e) {
        // dispatch(SpectrumSlice.actions.SpectrumsFetchedError(`Пожалуйста, авторизуйтесь (`))
        dispatch(SpectrumSlice.actions.SpectrumsFetched([filterMockData(searchValue), 0]))
    }
}

export const deleteSpecRequestById = (
    id: number,
    Satellite_id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(SatelliteSlice.actions.SatellitesFetching())
        const response = await axios.delete<IDeleteSpectrumRequest>(`/api/SpectrumsRequests`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                id: id,
            },
        });
        dispatch(SatelliteSlice.actions.SatellitesDeleteSuccess(response.data))
        dispatch(fetchSatelliteById(Satellite_id, setPage))
    } catch (e) {
        dispatch(SatelliteSlice.actions.SatellitesFetchedError(`${e}`))
    }
}

export const updateSpectrumInfo = (
    id: number,
    name: string,
    description: string,

) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));



    const config = {
        method: "put",
        url: `/api/Spectrums/${id}`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            id: id,
            name: name,
            description: description,
        },
    }

    try {
        dispatch(SpectrumSlice.actions.SpectrumsFetching())
        const response = await axios<IDefaultResponse>(config);
        const error = response.data.description ?? ""
        const success = error == "" ? 'Данные обновленны' : ''
        dispatch(SpectrumSlice.actions.SpectrumAddedIntoSatellite([error, success]))
        dispatch(fetchSpectrums())
    } catch (e) {
        dispatch(SpectrumSlice.actions.SpectrumsFetchedError(`Ошибка: ${e}`))
    }
}

export const updateSpectrumImage = (SpectrumId: number, file: File) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    const formData = new FormData();
    formData.append('file', file);
    formData.append('Spectrum_id', `${SpectrumId}`);

    const config = {
        method: "put",
        url: `/api/Spectrums/upload-image`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: formData,
    }

    try {
        dispatch(SpectrumSlice.actions.SpectrumsFetching())
        const response = await axios<IDefaultResponse>(config);
        const error = response.data.description ?? ""
        const success = error == "" ? 'Фото обновленно' : ''
        dispatch(SpectrumSlice.actions.SpectrumAddedIntoSatellite([error, success]))
        dispatch(fetchSpectrums())
    } catch (e) {
        dispatch(SpectrumSlice.actions.SpectrumsFetchedError(`Ошибка: ${e}`))
    }
}

export const deleteSatelliteById = (spectrum_id: number,satellite_id:number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(SatelliteSlice.actions.SatellitesFetching())
        const response = await axios.delete<IDeleteSpectrumRequest>(`/api/SpectrumsRequests`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                spectrum_id: spectrum_id,
                satellite_id: satellite_id
            },
        });
        dispatch(SatelliteSlice.actions.SatellitesDeleteSuccess(response.data))
        dispatch(fetchSatellites())
    } catch (e) {
        dispatch(SatelliteSlice.actions.SatellitesFetchedError(`${e}`))
    }
}

export const deleteSpectrum = (SpectrumId: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken')
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));

    const config = {
        method: "delete",
        url: `/api/Spectrums`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            id: SpectrumId
        },
    }

    try {
        dispatch(SpectrumSlice.actions.SpectrumsFetching())
        const response = await axios<IDefaultResponse>(config);
        const error = response.data.description ?? ""
        const success = error == "" ? 'Спектр удалён' : ''
        dispatch(SpectrumSlice.actions.SpectrumAddedIntoSatellite([error, success]))
        dispatch(fetchSpectrums())
    } catch (e) {
        dispatch(SpectrumSlice.actions.SpectrumsFetchedError(`Ошибка: ${e}`))
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
        // dispatch(SpectrumSlice.actions.SpectrumsFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Спектр "${SpectrumName}" добавлен`
        dispatch(SpectrumSlice.actions.SpectrumAddedIntoSatellite([errorText, successText]));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dispatch(fetchSpectrums(null, false))
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
        dispatch(SatelliteSlice.actions.SatellitesFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка удалена`
        dispatch(SatelliteSlice.actions.SatellitesUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchSatellites())
        }
        setTimeout(() => {
            dispatch(SatelliteSlice.actions.SatellitesUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(SatelliteSlice.actions.SatellitesDeleteError(`${e}`))
    }
}

export const makeSatellite = (id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        url: `/api/SatellitesUser/${id}`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },


    }
    try {
        dispatch(SatelliteSlice.actions.SatellitesFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Заявка создана`
        dispatch(SatelliteSlice.actions.SatellitesUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchSatellites())
        }
        setTimeout(() => {
            dispatch(SatelliteSlice.actions.SatellitesUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(SatelliteSlice.actions.SatellitesDeleteError(`${e}`))
    }
}

export const moderatorUpdateStatus = (SatelliteId: number, status: string, user_id: number) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "put",
        url: `/api/SatellitesModer/${SatelliteId}`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: {
            status: status,
            Satellite_id: SatelliteId,
            moder_id: user_id
        }
    }
    try {
        dispatch(SatelliteSlice.actions.SatellitesFetching())
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || `Ответ принят`
        dispatch(SatelliteSlice.actions.SatellitesUpdated([errorText, successText]));
        if (successText != "") {
            dispatch(fetchSatellites())
        }
        setTimeout(() => {
            dispatch(SatelliteSlice.actions.SatellitesUpdated(['', '']));
        }, 6000);
    } catch (e) {
        dispatch(SatelliteSlice.actions.SatellitesDeleteError(`${e}`))
    }
}

export const fetchSatellites = () => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(SatelliteSlice.actions.SatellitesFetching())
        const response = await axios.get<ISatelliteResponse>(`/api/Satellites`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const transformedResponse: IRequest = {
            Satellites: response.data.Satellites,
            status: response.data.status
        };
        dispatch(SatelliteSlice.actions.SatellitesFetched(transformedResponse))
    } catch (e) {
        dispatch(SatelliteSlice.actions.SatellitesFetchedError(`${e}`))
    }
}

export const fetchCurrentSatellite = () => async (dispatch: AppDispatch) => {
    interface ISingleSatelliteResponse {
        Satellites: number,
    }

    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        const response = await axios.get<ISingleSatelliteResponse>(`/api/Satellites/current`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        dispatch(SpectrumSlice.actions.setBasket(response.data.Satellites))

    } catch (e) {
        dispatch(SatelliteSlice.actions.SatellitesFetchedError(`${e}`))
    }
}

export const fetchSatelliteById = (
    id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    interface ISingleSatelliteResponse {
        Satellite: ISatellite,
    }

    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(SatelliteSlice.actions.SatellitesFetching())
        const response = await axios.get<ISingleSatelliteResponse>(`/api/Satellites/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        setPage(response.data.Satellite.satellite, response.data.Satellite.id)
        dispatch(SatelliteSlice.actions.SatelliteFetched(response.data.Satellite))
    } catch (e) {
        dispatch(SatelliteSlice.actions.SatellitesFetchedError(`${e}`))
    }
}

export const fetchSatellitesFilter = (dateStart?: string, dateEnd?: string, status?: string) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');
    dispatch(userSlice.actions.setAuthStatus(accessToken != null && accessToken != ""));
    try {
        dispatch(SatelliteSlice.actions.SatellitesFetching())
        const queryParams: Record<string, string | undefined> = {};
        if (dateStart) {
            queryParams.start_date = dateStart;
        }
        if (dateEnd) {
            queryParams.end_date = dateEnd;
        }
        if (status) {
            queryParams.status_id = status;
        }
        const queryString = Object.keys(queryParams)
            .map((key) => `${key}=${encodeURIComponent(queryParams[key]!)}`)
            .join('&');
        const urlWithParams = `/api/Satellites${queryString ? `?${queryString}` : ''}`;
        const response = await axios.get<ISatelliteResponse>(urlWithParams, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const transformedResponse: IRequest = {
            Satellites: response.data.Satellites,
            status: response.data.status
        };
        // console.log(transformedResponse.Satellites)
        dispatch(SatelliteSlice.actions.SatellitesFetched(transformedResponse))
    } catch (e) {
        dispatch(SatelliteSlice.actions.SatellitesFetchedError(`${e}`))
    }
}

export const deleteDestSatelliteById = (
    id: number,
    Satellite_id: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    const accessToken = Cookies.get('jwtToken');

    try {
        dispatch(SatelliteSlice.actions.SatellitesFetching())
        const response = await axios.delete<IDeleteSpectrumRequest>(`/api/SpectrumsRequests`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            data: {
                id: id,
            //     НАДО ПЕРЕДАВАТЬ ДВА АЙДИ
            },
        });
        dispatch(SatelliteSlice.actions.SatellitesDeleteSuccess(response.data))
        dispatch(fetchSatelliteById(Satellite_id, setPage))
    } catch (e) {
        dispatch(SatelliteSlice.actions.SatellitesFetchedError(`${e}`))
    }
}

export const updateSatellite = (
    id: number,
    SatelliteName: string,

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
            Satellite: SatelliteName,
            id: id,
        }
    };

    try {
        const response = await axios(config);
        const errorText = response.data.description ?? ""
        const successText = errorText || "Успешно обновленно"
        dispatch(SatelliteSlice.actions.SatellitesUpdated([errorText, successText]));
        setTimeout(() => {
            dispatch(SatelliteSlice.actions.SatellitesUpdated(['', '']));
        }, 5000);
    } catch (e) {
        dispatch(SatelliteSlice.actions.SatellitesFetchedError(`${e}`));
    }
}


export const fetchSpectrum = (
    SpectrumId: string,
    setPage: (name: string, id: number) => void
) => async (dispatch: AppDispatch) => {
    try {
        dispatch(SpectrumSlice.actions.SpectrumsFetching())
        // Теперь предполагаем, что response.data.Spectrums - это объект, а не массив
        const response = await axios.get<{ Spectrums: ISpectrum}>(`/api/Spectrums/${SpectrumId}`)
        console.log(response.data)
        const Spectrum = response.data.Spectrums  // Убрана индексация [0], так как это не массив
        console.log(Spectrum)
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

export const createSpectrum = (
    SpectrumName?: string,
    description?: string,
    image?: File | null
) => async (dispatch: AppDispatch) => {
    const formData = new FormData();
    if (SpectrumName) {
        formData.append('Spectrum_name', SpectrumName);
    }
    if (description) {
        formData.append('description', description);
    }
    if (image) {
        formData.append('image_url', image);
    }
    formData.append('status_id', '1');
    const accessToken = Cookies.get('jwtToken');

    const config = {
        method: "post",
        url: "/api/Spectrums",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    };

    try {
        dispatch(SpectrumSlice.actions.SpectrumsFetching())
        const response = await axios(config);
        const errorText = response.data.description || ''
        const successText = errorText == '' ? "Спектр создан" : ''
        dispatch(SpectrumSlice.actions.SpectrumAddedIntoSatellite([errorText, successText]))
        setTimeout(() => {
            dispatch(SpectrumSlice.actions.SpectrumAddedIntoSatellite(['', '']));
        }, 6000)

    } catch (e) {
        // dispatch(SpectrumSlice.actions.SpectrumsFetchedError(`Спектр добавлен`));
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
        const errorText = response.data.login == '' ? 'Ошибка разлогина' : ''
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
        const successText = errorText || "Добро пожаловать :)"
        dispatch(userSlice.actions.setStatuses([errorText, successText]));
        const jwtToken = response.data.access_token
        dispatch(userSlice.actions.setRole(response.data.role ?? ''))
        if (jwtToken) {
            Cookies.set('jwtToken', jwtToken);
            Cookies.set('role', response.data.role ?? '');
            dispatch(userSlice.actions.setAuthStatus(true));
            // Cookies.set('userImage', response.data.userImage)
            Cookies.set('userName', response.data.userName)
            Cookies.set('userId', response.data.userid)
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