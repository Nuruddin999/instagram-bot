import { configureStore } from '@reduxjs/toolkit'
import dataReducer from "../store/dataSlice"
export default configureStore({
    reducer: {
        data: dataReducer,
    }

})