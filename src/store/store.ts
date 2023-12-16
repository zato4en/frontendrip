import {combineReducers, configureStore} from "@reduxjs/toolkit";
import SpectrumReducer from "./reducers/SpectrumSlice.ts"
import SatelliteReducer from "./reducers/SatelliteSlice.ts"
import userReducer from "./reducers/UserSlice.ts"

const rootReducer = combineReducers({
    SpectrumReducer,
    SatelliteReducer,
    userReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']