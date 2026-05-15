
import { createSlice } from "@reduxjs/toolkit"
import { GetProductsByGmachCode } from "../api/productsGmachAPI"

const initialState = {
  productsByCodeGmach: [],
  gmachName: null,
  status: 'idle',
  error: null,
}

const productsGmachSlice = createSlice({
    name: "productsGmach",
    initialState,
    reducers: {
        updateGmachName: (state, action) => {
          state.gmachName = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(GetProductsByGmachCode.pending, (state) => {
            state.status = 'loading';
            state.error = null;
            state.productsByCodeGmach = [];
          })
          .addCase(GetProductsByGmachCode.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.productsByCodeGmach = Array.isArray(action.payload)
              ? action.payload
              : [];
          })
          .addCase(GetProductsByGmachCode.rejected, (state, action) => {
            state.status = 'failed';
            state.productsByCodeGmach = [];
            const p = action.payload;
            state.error =
              typeof p === 'string'
                ? p
                : action.error?.message ?? 'לא ניתן לטעון מוצרים';
          })
         ;
        }
})

export const { updateGmachName } = productsGmachSlice.actions

export default productsGmachSlice.reducer