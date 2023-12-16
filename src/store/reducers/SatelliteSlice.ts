import {IDeleteDestinationSatellite, IRequest} from "../../models/models.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface Satellitestate {
    Satellite: IRequest | null;
    isLoading: boolean;
    error: string;
    success: string;
}

const initialState: Satellitestate = {
    Satellite: null,
    isLoading: false,
    error: '',
    success: ''
}

export const satelliteSlice = createSlice({
    name: 'Satellite',
    initialState,
    reducers: {
        SatellitesFetching(state) {
            state.isLoading = true
        },
        SatellitesFetched(state, action: PayloadAction<IRequest>) {
            state.isLoading = false
            state.error = ''
            state.Satellite = action.payload
        },
        SatellitesDeleteSuccess(state, action: PayloadAction<IDeleteDestinationSatellite>) {
            state.isLoading = false
            const text = action.payload.description ?? ""
            state.error = text
            state.success = "Город успешно удалён из заявки"
        },
        SatellitesUpdated(state, action: PayloadAction<string[]>) {
            state.isLoading = false
            state.error = action.payload[0]
            state.success = action.payload[1]
        },
        SatellitesDeleteError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
        },
        SatellitesFetchedError(state, action: PayloadAction<string>) {
            state.isLoading = false
            state.error = action.payload
        },
    },
})

export default satelliteSlice.reducer;