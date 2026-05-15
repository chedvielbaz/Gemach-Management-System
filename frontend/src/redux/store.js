import { configureStore } from "@reduxjs/toolkit"
import usersReducer from "./slices/users"
import gmachimReducer from "./slices/gmachim"
import productsGmachSlice from "./slices/productsGmach"

export const store = configureStore({
    reducer: {
        users: usersReducer,
        gmachim: gmachimReducer,
        productsGmach: productsGmachSlice
    }
})
