import { createSlice } from "@reduxjs/toolkit"
import { addUserApi, GetCustomerByPassword } from "../api/usersApi";

const initialState = {
    currentUser: null,
    isAuthenticated: false, 
    isLoading: false,
    error: null,
    status: 'idle'
}

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        updateCurrentUser: (state, action) => {
            state.currentUser =  action.payload
        },
        logout: () => ({
            currentUser: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            status: 'idle',
        }),
        resetAuthFormStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    }, 
    extraReducers: (builder) => {
        builder
          .addCase(addUserApi.pending, (state) => {
            state.status = 'loading';
            state.error = null;
          })
          .addCase(addUserApi.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.currentUser = action.payload;
            const dto = action.payload;
            const email = dto?.custEmail ?? dto?.CustEmail;
            state.isAuthenticated =
              typeof email === 'string' && email.trim().length > 0;
          })
          .addCase(addUserApi.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload ?? { message: action.error.message };
          })
          .addCase(GetCustomerByPassword.pending, (state) => {
            state.status = 'loading';
            state.isLoading = true;
            state.error = null;
          })
          .addCase(GetCustomerByPassword.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.isLoading = false;
            const dto = action.payload;
            const email = dto?.custEmail ?? dto?.CustEmail;
            const ok = typeof email === "string" && email.trim().length > 0;
            state.isAuthenticated = ok;
            state.currentUser = ok
              ? {
                  custEmail: email.trim(),
                  custName: dto?.custName ?? dto?.CustName ?? "",
                }
              : null;
          })
          .addCase(GetCustomerByPassword.rejected, (state, action) => {
            state.status = 'failed';
            state.isLoading = false;
            state.error = action.payload;
          });
        }
})

export const { updateCurrentUser, logout, resetAuthFormStatus } =
    usersSlice.actions

export default usersSlice.reducer