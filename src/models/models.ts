export interface ISpectrums {
    Spectrums: ISpectrum[],
    status: string
}

export interface ISpectrumResponse {
    Spectrum: ISpectrum,
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

export const mockSpectrums: ISpectrum[] = [
    {id: 1, name: 'CMB1mock', len: 1.9,freq: 157.78, status_id: 1, status: {id: 1, status_name: 'Существует'}, description: 'CMB1 - имеет длину волны 1.9мм и частоту 157.788 Ггц', image_url: 'http://127.0.0.1:9000/spectrumbucket/ckrrk5droa2rl52rg7eg.jpeg'},
    {id: 2, name: 'CMB2mock', len: 2.72, freq: 110.08, status_id: 1, status: {id: 1, status_name: 'Существует'}, description: 'CMB2 - имеет длину волны 2.72мм и частоту 110.08 Ггц', image_url: 'http://127.0.0.1:9000/spectrumbucket/ckrrk5droa2rl52rg7eg.jpeg'},
    {id: 3, name: 'CMB3mock', len: 7.35, freq: 40.86,status_id: 1, status: {id: 1, status_name: 'Существует'},description: 'CMB3 - имеет длину волны 7.35мм и частоту 40.86 Ггц', image_url: 'http://127.0.0.1:9000/spectrumbucket/ckrrk5droa2rl52rg7eg.jpeg'}
]
