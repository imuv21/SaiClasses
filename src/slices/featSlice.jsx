import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;


export const getVideos = createAsyncThunk(
    'feat/getVideos',
    async ({ page, size, classOp, subject, sortBy, order }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            const response = await axios.get(`${BASE_URL}/api/v1/feat/videos`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                params: { page, size, classOp, subject, sortBy, order }
            });
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
            }
        }
    }
);

const initialState = {

    videoLoading: false,
    videoError: null,
    videos: [],
    totalVideos: 0,
    totalPages: 0,
    pageVideos: 0,
    isFirst: false,
    isLast: false,
    hasNext: false,
    hasPrevious: false,
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

                state.videos = action.payload?.videos || [];
                state.totalVideos = action.payload?.totalVideos || 0;
                state.totalPages = action.payload?.totalPages || 0;
                state.pageVideos = action.payload?.pageVideos || 0;

                state.isFirst = action.payload?.isFirst || false;
                state.isLast = action.payload?.isLast || false;
                state.hasNext = action.payload?.hasNext || false;
                state.hasPrevious = action.payload?.hasPrevious || false;
            })
            .addCase(getVideos.rejected, (state, action) => {
                state.videoLoading = false;
                state.videoError = action.payload?.message || "Something went wrong!";
            });
    },
});

export default featSlice.reducer;
