import {combineReducers, configureStore} from "@reduxjs/toolkit";
import SpectrumReducer from "./reducers/SpectrumSlice.ts"
import hikeReducer from "./reducers/HikeSlice.ts"
import userReducer from "./reducers/UserSlice.ts"

const rootReducer = combineReducers({
    SpectrumReducer,
    hikeReducer,
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