import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiAuth from "../apis/ApiAuth.js";
import { resetLearningClass } from "./learningClassSlice.js"; 
import { resetSchedule } from "./scheduleSlice.js"; 

const initialState = {
  userInfo: {},
  isLoading: false,
  hasCheckedAuth: false,
  type: "",
};

export const Login = createAsyncThunk("auth/Login", async (data, thunkAPI) => {
  const response = await ApiAuth.LoginTCApi(data);
  return response;
});

export const LoginHDB = createAsyncThunk(
  "auth/LoginHDB",
  async (data, thunkAPI) => {
    const response = await ApiAuth.LoginHDBApi(data);
    return response;
  }
);

export const GetAccount = createAsyncThunk(
  "auth/GetAccount",
  async (thunkAPI) => {
    const userString = localStorage.getItem("fr");
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  }
);

export const logout = createAsyncThunk("auth/Logout", async (_, { dispatch }) => {
    localStorage.removeItem("fr");
    localStorage.removeItem("type");
    dispatch(resetLearningClass()); 
    dispatch(resetSchedule()); 

    return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
  },

  extraReducers: (builder) => {
    // Login
    builder
      .addCase(Login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.userInfo = action.payload.data || {};
          localStorage.setItem("type", "TC");
          localStorage.setItem("fr", JSON.stringify(action.payload.data));
          state.type = "TC";
        }
      })
      .addCase(Login.rejected, (state, action) => {
        state.isLoading = false;
      });

    // GetAccount
    builder
      .addCase(GetAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(GetAccount.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.isLoading = false;
        state.hasCheckedAuth = true;
        state.type = localStorage.getItem("type");
      })
      .addCase(GetAccount.rejected, (state, action) => {
        state.userInfo = null;
        state.isLoading = false;
        state.hasCheckedAuth = true;
        localStorage.removeItem("fr");
      });

    // LoginHDB
    builder
      .addCase(LoginHDB.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LoginHDB.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.userInfo = action.payload.data || {};
          localStorage.setItem("fr", JSON.stringify(action.payload.data));
          state.type = "HBD";
          localStorage.setItem("type", "HBD");
        }
      })
      .addCase(LoginHDB.rejected, (state, action) => {
        state.isLoading = false;
      });

    // logout
    builder
        .addCase(logout.fulfilled, (state) => {
            state.userInfo = {};
            state.isLoading = false;
            state.hasCheckedAuth = true;
            state.type = "";
        });
  },
});

export { }; 

// Export reducer
export default authSlice.reducer;