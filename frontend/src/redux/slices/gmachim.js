
import { createSlice } from "@reduxjs/toolkit"
import { addGmachAPI, DeleteGmach, getAllGmachKindsApi, GetGmachesByKind, getMyGmachesApi } from "../api/gmachimAPI"

const initialState = {
    gmachimByCategory: [],
    typeGmach: null,
    gmachimTypes: [],
    /** נקבע אחרי ניסיון טעינה מהשרת (הצלחה או כישלון) כדי לא להציג ספינר נצחי כשאין קטגוריות במסד */
    gmachKindsFetched: false,
    gmachKindsLoading: false,
    gmachKindsError: null,
    /** טעינת טבלת גמ״חים לפי קטגוריה — נפרד מסטטוס כללי */
    gmachByCategoryLoading: false,
    gmachByCategoryError: null,
    /** גמ״חים של המשתמש המחובר — דף האזור האישי */
    myGmachesList: [],
    myGmachesLoading: false,
    myGmachesError: null,
    /** הוספת גמ״ח — לא מתערב בטעינת סוגים / רשימות אחרות */
    addGmachStatus: "idle",
    addGmachError: null,
    deleteGmachStatus: "idle",
    deleteGmachError: null,
}

const gmachimSlice = createSlice({
    name: "gmachim",
    initialState,
    reducers: {
        updateTypeGmach: (state, action) => {
          state.typeGmach = action.payload
        },
        /** לאחר הצלחה / סגירת Alert בשגיאת שמירה — לא משפיע על טעינת קטגוריות */
        setStatusToIdle: (state) => {
          state.addGmachStatus = "idle";
          state.addGmachError = null;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(addGmachAPI.pending, (state) => {
            state.addGmachStatus = "loading";
            state.addGmachError = null;
          })
          .addCase(addGmachAPI.fulfilled, (state) => {
            state.addGmachStatus = "succeeded";
          })
          .addCase(addGmachAPI.rejected, (state, action) => {
            state.addGmachStatus = "failed";
            const p = action.payload;
            state.addGmachError =
              p && typeof p.message === "string"
                ? p.message
                : action.error?.message ?? null;
          })
          .addCase(getAllGmachKindsApi.pending, (state) => {
            state.gmachKindsLoading = true;
            state.gmachKindsError = null;
          })
          .addCase(getAllGmachKindsApi.fulfilled, (state, action) => {
            state.gmachKindsLoading = false;
            state.gmachKindsFetched = true;
            state.gmachKindsError = null;
            state.gmachimTypes = Array.isArray(action.payload) ? action.payload : [];
          })
          .addCase(getAllGmachKindsApi.rejected, (state, action) => {
            state.gmachKindsLoading = false;
            state.gmachKindsFetched = true;
            const p = action.payload;
            state.gmachKindsError =
              typeof p === "string" && p.trim()
                ? p.trim()
                : typeof action.error?.message === "string"
                  ? action.error.message
                  : "לא ניתן לטעון את סוגי הגמ״ח.";
          })
          .addCase(GetGmachesByKind.pending, (state) => {
            state.gmachByCategoryLoading = true;
            state.gmachByCategoryError = null;
            state.gmachimByCategory = [];
          })
          .addCase(GetGmachesByKind.fulfilled, (state, action) => {
            state.gmachByCategoryLoading = false;
            state.gmachByCategoryError = null;
            state.gmachimByCategory = Array.isArray(action.payload)
              ? action.payload
              : [];
          })
          .addCase(GetGmachesByKind.rejected, (state, action) => {
            state.gmachByCategoryLoading = false;
            state.gmachimByCategory = [];
            const p = action.payload;
            state.gmachByCategoryError =
              typeof p === 'string'
                ? p
                : action.error?.message ??
                  'לא ניתן לטעון את רשימת הגמ״חים מהשרת.';
          })
          .addCase(getMyGmachesApi.pending, (state) => {
            state.myGmachesLoading = true;
            state.myGmachesError = null;
          })
          .addCase(getMyGmachesApi.fulfilled, (state, action) => {
            state.myGmachesLoading = false;
            state.myGmachesError = null;
            state.myGmachesList = Array.isArray(action.payload) ? action.payload : [];
          })
          .addCase(getMyGmachesApi.rejected, (state, action) => {
            state.myGmachesLoading = false;
            state.myGmachesList = [];
            const p = action.payload;
            state.myGmachesError =
              typeof p === 'string'
                ? p
                : action.error?.message ?? 'לא ניתן לטעון את הגמ״חים שלך.';
          })
          .addCase(DeleteGmach.pending, (state) => {
            state.deleteGmachStatus = "loading";
            state.deleteGmachError = null;
          })
          .addCase(DeleteGmach.fulfilled, (state) => {
            state.deleteGmachStatus = "succeeded";
            state.deleteGmachError = null;
          })
          .addCase(DeleteGmach.rejected, (state, action) => {
            state.deleteGmachStatus = "failed";
            state.deleteGmachError =
              typeof action.error?.message === "string"
                ? action.error.message
                : null;
          });
        }
})

export const { updateTypeGmach, setStatusToIdle } = gmachimSlice.actions

export default gmachimSlice.reducer