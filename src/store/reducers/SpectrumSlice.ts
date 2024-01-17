import {ISpectrum} from "../../models/models.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface SpectrumState {
    Spectrums: ISpectrum[];
    Spectrum: ISpectrum | null,
    isLoading: boolean;
    error: string;
    basketID:number;
    success: string;
    serialNumber: number;
}



const initialState: SpectrumState = {
    Spectrums: [],
    Spectrum: null,
    isLoading: false,
    basketID:0,
    error: '',
    success: '',
    serialNumber: 0
}

export const SpectrumSlice = createSlice({
    name: 'Spectrum',
    initialState,
    reducers: {
        increase(state) {
            state.serialNumber += 1
        },
        minus(state) {
            state.serialNumber = state.serialNumber == 0 ? 0 :  state.serialNumber - 1
        },
        reset(state) {
            state.serialNumber += 0
        },
        SpectrumsFetching(state) {
            state.isLoading = true
            state.error = ''
            state.success = ''
        },
        SpectrumsFetched(state, action: PayloadAction<[ISpectrum[], number]>) {
            state.isLoading = false
            state.Spectrums = action.payload[0]
            state.basketID = action.payload[1]
            console.log(action.payload[1])
        },
        SpectrumsFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
            state.success = ''
        },
        SpectrumAddedIntoSatellite(state, action: PayloadAction<string[]>) {
            state.isLoading = false
            state.error = action.payload[0]
            state.success = action.payload[1]
        },
        SpectrumFetching(state) {
            state.isLoading = true
            state.error = ''
            state.success = ''
        },
        SpectrumFetched(state, action: PayloadAction<ISpectrum>) {
            state.isLoading = false
            state.error = ''
            state.Spectrum = action.payload
        },
        SpectrumFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
            state.Spectrums = []
            state.Spectrum = null
        },
    },
})

export default SpectrumSlice.reducer;