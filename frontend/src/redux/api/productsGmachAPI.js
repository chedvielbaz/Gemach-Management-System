import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  axiosDeleteWithFallback,
  axiosGetWithFallback,
  axiosPutWithFallback,
} from '../../config/apiBase';
import { devError } from '../../utils/devLog';

export const GetProductsByGmachCode = createAsyncThunk(
  'productsGmach/GetProductsByGmachCode',
  async (gmachCode, thunkAPI) => {
    try {
      const code = Number(gmachCode);
      const urlSegment = `Product/GetProductsByGmachCode/${code}`;
      const response = await axiosGetWithFallback(axios, urlSegment);
      return response.data;
    } catch (error) {
      devError(error, 'GetProductsByGmachCode error');
      const data = error.response?.data;
      const msg =
        typeof data === 'string'
          ? data
          : typeof data === 'object' &&
              data !== null &&
              typeof data.message === 'string'
            ? data.message
            : error.message ?? 'לא ניתן לטעון מוצרים';
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

/** מוחק את כל המוצרים של הגמ״ח ומוסיף רשימה מחודשת (אחרי עדכון פרטי הגמ״ח). */
export async function replaceProductsForGmach(gmachCode, items) {
  const code = Number(gmachCode);
  if (!Number.isFinite(code)) {
    throw new Error('קוד גמ״ח לא תקין.');
  }
  const del = await axiosDeleteWithFallback(
    axios,
    `Product/DeleteProductsByGmachCode/${code}`
  );
  if (del.data === false) {
    throw new Error('לא ניתן לעדכן את רשימת המוצרים (מחיקה ישנה נכשלה).');
  }
  if (!items.length) return;
  const body = items.map((p) => ({
    productCode: 0,
    productName: p.productName,
    productCount: p.productCount,
    gmachCode: code,
  }));
  const put = await axiosPutWithFallback(axios, 'Product/AddProducts', body);
  if (put.data === false) {
    throw new Error('לא ניתן לשמור את רשימת המוצרים המעודכנת.');
  }
}
