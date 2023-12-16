import {combineReducers, configureStore} from "@reduxjs/toolkit";
import cityReducer from "./reducers/SpectrumSlice.ts"
import hikeReducer from "./reducers/HikeSlice.ts"
import userReducer from "./reducers/UserSlice.ts"

const rootReducer = combineReducers({
    cityReducer,
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