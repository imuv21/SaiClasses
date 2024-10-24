import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getVideos = createAsyncThunk(
    'feat/getVideos',
    async ({ page, size, classOp, subject }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            const response = await axios.get(`${BASE_URL}/feat/videos`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                params: { page, size, classOp, subject }
            });

            if (response.data.success === false || response.data.status === 'failed') {
                return rejectWithValue(response.data.errors || { message: response.data.message });
            }
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
                return rejectWithValue(error.response.data.errors);
            }
            return rejectWithValue({ message: error.message });
        }
    }
);

const initialState = {
    videos: [],
    videoLoading: false,
    videoError: null,

    totalVideos: 0,
    currentPage: 1,
    pageSize: 3,
    totalPages: 1,
};

const featSlice = createSlice({
    name: 'feat',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getVideos.pending, (state) => {
                state.videoLoading = true;
                state.videoError = null;
            })
            .addCase(getVideos.fulfilled, (state, action) => {
                state.videoLoading = false;
                state.videoError = null;

                state.videos = action.payload.videos;
                state.totalPages = action.payload.totalPages;
                state.pageSize = action.payload.pageSize;
                state.currentPage = action.payload.currentPage;
                state.totalVideos = action.payload.totalVideos;
            })
            .addCase(getVideos.rejected, (state, action) => {
                state.videoLoading = false;
                state.videoError = action.payload.message;
            });
    },
});

export default featSlice.reducer;
