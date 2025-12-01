import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ApiNews from "../apis/ApiNews.js";

const initialState = {
  newsListOther: [],
  totalNewsOther: 0,
  newsListAll: [],
  totalNewsAll: 0,
};

export const getNewsByID = createAsyncThunk(
  "news/getNewsByID",
  async ({ newsID }, thunkAPI) => {
    const response = await ApiNews.getNewsByIDApi(newsID);
    return response;
  }
);

export const getNewsOther = createAsyncThunk(
  "news/getNewsOther",
  async ({ newsID, page, limit }, thunkAPI) => {
    const response = await ApiNews.getNewsOtherApi(newsID, page, limit);
    return response;
  }
);

export const getNewsAll = createAsyncThunk(
  "news/getNewsAll",
  async ({ status, key, page, limit }, thunkAPI) => {
    const response = await ApiNews.getNewsAllApi(status, key, page, limit);
    return response;
  }
);

const newSlice = createSlice({
  name: "news",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // getNewsByID
    builder
      .addCase(getNewsByID.pending, (state) => {})
      .addCase(getNewsByID.fulfilled, (state, action) => {})
      .addCase(getNewsByID.rejected, (state, action) => {});

    // getNewsOther
    builder
      .addCase(getNewsOther.pending, (state) => {})
      .addCase(getNewsOther.fulfilled, (state, action) => {
        state.newsListOther = action.payload.data || [];
        state.totalNewsOther = action.payload.totals || 0;
      })
      .addCase(getNewsOther.rejected, (state, action) => {});

    // getNewsAll
    builder
      .addCase(getNewsAll.pending, (state) => {})
      .addCase(getNewsAll.fulfilled, (state, action) => {
        state.newsListAll = action.payload.data || [];
        state.totalNewsAll = action.payload.totals || 0;
      })
      .addCase(getNewsAll.rejected, (state, action) => {});
  },
});

// Export actions
export const {} = newSlice.actions;

// Export reducer
export default newSlice.reducer;
