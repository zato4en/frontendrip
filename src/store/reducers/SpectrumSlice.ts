import {ISpectrum} from "../../models/models.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface SpectrumState {
    Spectrums: ISpectrum[];
    Spectrum: ISpectrum | null,
    isLoading: boolean;
    error: string;
    success: string;
    serialNumber: number;
    basketID: number;
}

const initialState: SpectrumState = {
    Spectrums: [],
    Spectrum: null,
    isLoading: false,
    error: '',
    success: '',
    serialNumber: 1,
    basketID: 0
}

export const SpectrumSlice = createSlice({
    name: 'Spectrum',
    initialState,
    reducers: {
        increase(state) {
            state.serialNumber += 1
        },
        minus(state) {
            state.serialNumber = state.serialNumber == 1 ? 1 :  state.serialNumber - 1
        },
        reset(state) {
            state.serialNumber = 1
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
        },
        SpectrumsFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
            state.success = ''
        },
        setBasket(state, action: PayloadAction<number>) {
            state.basketID = action.payload
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