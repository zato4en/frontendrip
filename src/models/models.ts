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
    {id: 1, name: 'CMB1mock', len: 1.9,freq: 157.78, status_id: 1, status: {id: 1, status_name: 'Существует'}, description: 'CMB1 - имеет длину волны 1.9мм и частоту 157.788 Ггц', image_url: 'http://172.21.0.3:9000/spectrumbucket/CMB1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=3DR34MJFUPPY0JFBB2EZ%2F20231025%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231025T072823Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiIzRFIzNE1KRlVQUFkwSkZCQjJFWiIsImV4cCI6MTY5ODIyMjQ5NiwicGFyZW50IjoibWluaW8ifQ.adFyKygCg-7HE0kMBWv8pDTDF_7RHjPTndfiOq2v71B4oB8z2YsPdQkGIQ4YzatxiUP2dWlMFWBo1BDoIr6UkQ&X-Amz-SignedHeaders=host&versionId=befcc374-8ed5-42b4-bf5a-7897b7319991&X-Amz-Signature=0fd530f80d55fb2b278eb46d07e832a26f47fe93d2a083783c6ac0c4bc129df6'},
    {id: 2, name: 'CMB2mock', len: 2.72, freq: 110.08, status_id: 1, status: {id: 1, status_name: 'Существует'}, description: 'CMB2 - имеет длину волны 2.72мм и частоту 110.08 Ггц', image_url: 'http://172.21.0.3:9000/spectrumbucket/CMB2.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=3DR34MJFUPPY0JFBB2EZ%2F20231025%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231025T072834Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiIzRFIzNE1KRlVQUFkwSkZCQjJFWiIsImV4cCI6MTY5ODIyMjQ5NiwicGFyZW50IjoibWluaW8ifQ.adFyKygCg-7HE0kMBWv8pDTDF_7RHjPTndfiOq2v71B4oB8z2YsPdQkGIQ4YzatxiUP2dWlMFWBo1BDoIr6UkQ&X-Amz-SignedHeaders=host&versionId=604461e6-dba4-4aec-a882-798855536608&X-Amz-Signature=73fe40582bced59977b56d7e7a6d6d7abbe042e6914e3b211102b1eb4b5760a8'},
    {id: 3, name: 'CMB3mock', len: 7.35, freq: 40.86,status_id: 1, status: {id: 1, status_name: 'Существует'},description: 'CMB3 - имеет длину волны 7.35мм и частоту 40.86 Ггц', image_url: 'http://172.21.0.3:9000/spectrumbucket/CMB3.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=3DR34MJFUPPY0JFBB2EZ%2F20231025%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231025T072853Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiIzRFIzNE1KRlVQUFkwSkZCQjJFWiIsImV4cCI6MTY5ODIyMjQ5NiwicGFyZW50IjoibWluaW8ifQ.adFyKygCg-7HE0kMBWv8pDTDF_7RHjPTndfiOq2v71B4oB8z2YsPdQkGIQ4YzatxiUP2dWlMFWBo1BDoIr6UkQ&X-Amz-SignedHeaders=host&versionId=ab76dd0d-5a6a-439e-91eb-687e41608ef7&X-Amz-Signature=9c7f45d092ec0534f628bb2416b8a99bd13b75ebe40620f7e17dbf6623e92e83'}
]
