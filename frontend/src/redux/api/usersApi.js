import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  axiosPostWithFallback,
  axiosPutWithFallback,
} from '../../config/apiBase';
import { devError } from '../../utils/devLog';

export const addUserApi = createAsyncThunk(
  'users/addUser',
  async (customer, thunkAPI) => {
    try {
      const response = await axiosPutWithFallback(
        axios,
        'Customer/AddCustomer',
        customer
      );
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      let message =
        typeof data === 'object' && data !== null && typeof data.message === 'string'
          ? data.message
          : typeof data === 'string'
            ? data
            : error.message;
      devError(error, 'addUser error');
      return thunkAPI.rejectWithValue({ status, message });
    }
  }
);

export const GetCustomerByPassword = createAsyncThunk(
  'users/getCustomerByPassword',
  async (customer, thunkAPI) => {
    try {
      const response = await axiosPostWithFallback(
        axios,
        'Customer/GetCustomerByPassword',
        customer
      );
      return response.data;
    } catch (error) {
      devError(error, 'GetCustomerByPassword error');
      const data = error.response?.data;
      const message =
        typeof data === 'string'
          ? data
          : typeof data === 'object' &&
              data !== null &&
              typeof data.message === 'string'
            ? data.message
            : error.message ?? 'התחברות נכשלה';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
