import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  axiosDeleteWithFallback,
  axiosGetWithFallback,
  axiosPostWithFallback,
  axiosPutWithFallback,
} from '../../config/apiBase';
import { devError } from '../../utils/devLog';

/** השרת לפעמים עוטף מערך — מאחדים ל־[]. */
function normalizeGmachArray(raw) {
  const unwrapKeys = [
    '$values',
    'items',
    'data',
    'results',
    'value',
    'gmaches',
    'Gmaches',
  ];
  let cur = raw;
  for (let depth = 0; depth < 8; depth += 1) {
    if (cur == null) return [];
    if (Array.isArray(cur)) return cur;
    if (typeof cur !== 'object') return [];
    let next = null;
    for (let i = 0; i < unwrapKeys.length; i += 1) {
      const k = unwrapKeys[i];
      if (Object.prototype.hasOwnProperty.call(cur, k)) {
        next = cur[k];
        break;
      }
    }
    if (next === null) return [];
    cur = next;
  }
  return Array.isArray(cur) ? cur : [];
}

export const getAllGmachKindsApi = createAsyncThunk(
  'gmachim/getAllGmachKinds',
  async (_, thunkAPI) => {
    try {
      const response = await axiosGetWithFallback(axios, 'Gmach/GetAllGmachKinds');
      return response.data;
    } catch (error) {
      devError(error, 'getAllGmachKinds error');
      const data = error.response?.data;
      const msg =
        typeof data === 'string'
          ? data
          : typeof data === 'object' &&
              data !== null &&
              typeof data.message === 'string'
            ? data.message
            : error.message || 'לא ניתן לטעון את סוגי הגמ״ח';
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const GetGmachesByKind = createAsyncThunk(
  'gmachim/GetGmachesByKind',
  async (gmachKind, thunkAPI) => {
    const code = Number(gmachKind);
    if (!Number.isFinite(code)) {
      return thunkAPI.rejectWithValue('invalid-gmach-kind');
    }
    try {
      const response = await axiosGetWithFallback(
        axios,
        `Gmach/GetGmachesByKind/${code}`
      );
      return normalizeGmachArray(response.data);
    } catch (error) {
      devError(error, 'GetGmachesByKind error');
      const status = error.response?.status;
      const detail =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.title || error.response?.data?.detail || '';
      const msg =
        [status && `קוד ${status}`, detail || error.message]
          .filter(Boolean)
          .join(' — ') || 'שגיאת רשת בטעינת הגמ״חים';
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const addGmachAPI = createAsyncThunk(
  'gmachim/addGmach',
  async (request, thunkAPI) => {
    try {
      const response = await axiosPutWithFallback(
        axios,
        'Gmach/AddGmach',
        request
      );
      return response.data;
    } catch (error) {
      devError(error, 'addGmach error');
      const data = error.response?.data;
      let message =
        typeof data === 'object' && data !== null && typeof data.message === 'string'
          ? data.message
          : typeof data === 'string'
            ? data
            : error.message;
      return thunkAPI.rejectWithValue({
        message,
        status: error.response?.status,
      });
    }
  }
);

export const DeleteGmach = createAsyncThunk(
  'gmachim/DeleteGmach',
  async ({ id, custEmail }, thunkAPI) => {
    try {
      const response = await axiosDeleteWithFallback(
        axios,
        `Gmach/DeleteGmach/${id}`,
        { params: { custEmail } }
      );
      return response.data;
    } catch (error) {
      devError(error, 'DeleteGmach error');
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);

export const getMyGmachesApi = createAsyncThunk(
  'gmachim/getMyGmaches',
  async (custEmail, thunkAPI) => {
    const email = String(custEmail ?? '').trim();
    if (!email) {
      return thunkAPI.rejectWithValue('חסר מייל משתמש מחובר');
    }
    try {
      const response = await axiosGetWithFallback(axios, 'Gmach/GetMyGmaches', {
        params: { custEmail: email },
      });
      return normalizeGmachArray(response.data);
    } catch (error) {
      devError(error, 'getMyGmaches error');
      const status = error.response?.status;
      const detail =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message || '';
      const msg =
        [status && `קוד ${status}`, detail || error.message]
          .filter(Boolean)
          .join(' — ') || 'לא ניתן לטעון את הגמ״חים שלך';
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const updateGmachApi = createAsyncThunk(
  'gmachim/updateGmach',
  async ({ gmach, custEmail }, thunkAPI) => {
    const owner = String(custEmail ?? '').trim();
    if (!owner || !gmach) {
      return thunkAPI.rejectWithValue({
        message: 'חסרים פרטי משתמש או גמ״ח',
      });
    }
    try {
      const q = new URLSearchParams({ custEmail: owner }).toString();
      await axiosPostWithFallback(axios, `Gmach/UpdateGmach?${q}`, gmach);
      return gmach.gmachCode ?? gmach.GmachCode;
    } catch (error) {
      devError(error, 'updateGmach error');
      const data = error.response?.data;
      let message =
        typeof data === 'object' && data !== null && typeof data.message === 'string'
          ? data.message
          : typeof data === 'string'
            ? data
            : error.message;
      return thunkAPI.rejectWithValue({
        message,
        status: error.response?.status,
      });
    }
  }
);
