export interface ICities {
    cities: ISpectrum[],
    status: string
}

export interface ISpectrumResponse {
    spectrum: ISpectrum,
    status: string
}

export interface IStatus {
    id: number,
    status_name: string,
}

export interface ISpectrum {
    id: number,
    name?: string,
    len?: number,
    freq?: number,
    status_id?: number,
    status: IStatus,
    description?: string,
    image_url?: string,
}

export interface IDestinationHikes {
    id: number,
    city_id: number,
    hike_id: number,
    serial_number: number,
    city: ICity,
}

export interface IRegisterResponse {
    login: string
    password: string
}

export interface IAuthResponse {
    access_token?: string,
    description?: string,
    status?: string,
}

export interface IUser {
    id: number,
    user_name: string,
    profession: string,
    login: string,
    birthday: string,
    image_url: string,
    password: string,
}

export interface IHike {
    id: number,
    hike_name: string,
    date_created: string,
    date_end: string,
    date_start_of_processing: string,
    date_approve: string,
    date_start_hike: string,
    user_id: number,
    status_id: number,
    description: string,
    status: IStatus,
    leader: string,
    destination_hikes: IDestinationHikes[],
    user: IUser,
}

export interface IUpdateHike {
    description?: string
}

export interface IDeleteDestinationHike {
    deleted_destination_hike: number,
    status: string,
    description?: string,
}

export interface IRequest {
    hikes: IHike[]
    status: string
}



export const mockSpectrums: ISpectrum[] = [
    {id: 1, name: 'CMB1mock', len: 1.9,freq: 157.78, status_id: 1, status: {id: 1, status_name: 'Существует'}, description: 'CMB1 - имеет длину волны 1.9мм и частоту 157.788 Ггц', image_url: 'http://127.0.0.1:9000/spectrumbucket/default.jpeg'},
    {id: 2, name: 'CMB2mock', len: 2.72, freq: 110.08, status_id: 1, status: {id: 1, status_name: 'Существует'}, description: 'CMB2 - имеет длину волны 2.72мм и частоту 110.08 Ггц', image_url: 'http://127.0.0.1:9000/spectrumbucket/default.jpeg'},
    {id: 3, name: 'CMB3mock', len: 7.35, freq: 40.86,status_id: 1, status: {id: 1, status_name: 'Существует'},description: 'CMB3 - имеет длину волны 7.35мм и частоту 40.86 Ггц', image_url: 'http://127.0.0.1:9000/spectrumbucket/default.jpeg'}
]