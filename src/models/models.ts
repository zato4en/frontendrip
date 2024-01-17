export interface ISpectrums {
    Spectrums: ISpectrum[],
    status?: string
}

export interface ISpectrumResponse {
    Spectrums: ISpectrum,
    status?: string
}

// export interface IStatus {
//     id: number,
//     status_name?: string,
// }
export interface ISpectrumWithBasket {
    Satellite_id: number
    Spectrums: ISpectrum[]
}

export interface ISpectrum {
    id: number,
    name?: string,
    len?: number,
    freq?: number,
    status_id?: number,
    status?: string,
    description?: string,
    image_url?: string,
}

export interface ISpectrumRequests {
    id: number,
    spectrum_id: number,
    satellite_id: number,
    satellite_number?: number,
    spectrum: ISpectrum,
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

// export interface IUser {
//     id: number,
//     user_name: string,
//     profession?: string,
//     user_login: string,
//     birthday?: string,
//     image_url?: string,
//     password: string,
// }

export interface ISatellite {
    id: number,
    satellite: string,
    date_create: string,
    date_formation: string,
    date_completion: string,
    user_id: number,
    moder_id: number,
    status: string,
    spectrum_requests: ISpectrumRequests[],
    user_login: string,
    moder_login: string,
    percentage:string
}

export interface IUpdateSatellite {
    description?: string
}

export interface IDeleteSpectrumRequest {
    deleted_spectrum_request: number,
    status: string,
    description?: string,
}

export interface IRequest {
    Satellites: ISatellite[]
    status?: string
}

export interface ISatelliteResponse {
    Satellites: ISatellite[]
    status?: string
}


export const mockSpectrums: ISpectrum[] = [
    {id: 1, name: 'CMB1mock', len: 1.9,freq: 157.78, status_id: 1, status: {id: 1, status_name: 'Существует'}, description: 'CMB1 - имеет длину волны 1.9мм и частоту 157.788 Ггц', image_url: 'http://127.0.0.1:9000/spectrumbucket/default.jpeg'},
    {id: 2, name: 'CMB2mock', len: 2.72, freq: 110.08, status_id: 1, status: {id: 1, status_name: 'Существует'}, description: 'CMB2 - имеет длину волны 2.72мм и частоту 110.08 Ггц', image_url: 'http://127.0.0.1:9000/spectrumbucket/default.jpeg'},
    {id: 3, name: 'CMB3mock', len: 7.35, freq: 40.86,status_id: 1, status: {id: 1, status_name: 'Существует'},description: 'CMB3 - имеет длину волны 7.35мм и частоту 40.86 Ггц', image_url: 'http://127.0.0.1:9000/spectrumbucket/default.jpeg'}
]