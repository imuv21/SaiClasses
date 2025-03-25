import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;


export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/auth/signup`, userData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
                return rejectWithValue(error.response.data.errors);
            }
        }
    }
);

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/auth/verify-otp`, userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
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

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/auth/login`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
                return rejectWithValue(error.response.data.errors);
            }
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/auth/forgot-password`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
                return rejectWithValue(error.response.data.errors);
            }
        }
    }
);

export const verifyPassword = createAsyncThunk(
    'auth/verifyPassword',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/auth/verify-password-otp`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
                return rejectWithValue(error.response.data.errors);
            }
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            const response = await axios.patch(`${BASE_URL}/api/v1/auth/update-profile`, userData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response.data;

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    return rejectWithValue({ message: error.response.data.message });
                }
                return rejectWithValue(error.response.data.errors);
            }
        }
    }
);

const initialState = {

    user: null,
    token: null,
    logLoading: false,
    logErrors: null,
    logError: null,

    signupData: null,
    signLoading: false,
    signErrors: null,
    signError: null,

    otpLoading: false,
    otpError: null,

    emailData: null,
    fopaLoading: false,
    fopaErrors: null,
    fopaError: null,

    vepaLoading: false,
    vepaErrors: null,
    vepaError: null,

    profLoading: false,
    profErrors: null,
    profError: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.signErrors = null;
            state.signError = null;
            state.logErrors = null;
            state.logError = null;
            state.otpError = null;
            state.fopaErrors = null;
            state.fopaError = null;
            state.vepaErrors = null;
            state.vepaError = null;
            state.profErrors = null;
            state.profError = null;
        },
        setSignupData: (state, action) => {
            state.signupData = action.payload;
        },
        setEmailData: (state, action) => {
            state.emailData = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.signLoading = true;
                state.signErrors = null;
                state.signError = null;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.signLoading = false;
                state.signErrors = null;
                state.signError = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.signLoading = false;
                if (Array.isArray(action.payload)) {
                    state.signErrors = action.payload;
                } else {
                    state.signError = action.payload?.message || "Something went wrong!";
                }
            })

            .addCase(verifyOtp.pending, (state) => {
                state.otpLoading = true;
                state.otpError = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.otpLoading = false;
                state.otpError = null;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.otpLoading = false;
                state.otpError = action.payload?.message || "Something went wrong!";
            })

            .addCase(loginUser.pending, (state) => {
                state.logLoading = true;
                state.logErrors = null;
                state.logError = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.logLoading = false;
                state.logErrors = null;
                state.logError = null;
                state.user = action.payload?.user || null;
                state.token = action.payload?.token || null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.logLoading = false;
                if (Array.isArray(action.payload)) {
                    state.logErrors = action.payload;
                } else {
                    state.logError = action.payload?.message || "Something went wrong!";
                }
            })

            .addCase(forgotPassword.pending, (state) => {
                state.fopaLoading = true;
                state.fopaErrors = null;
                state.fopaError = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.fopaLoading = false;
                state.fopaErrors = null;
                state.fopaError = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.fopaLoading = false;
                if (Array.isArray(action.payload)) {
                    state.fopaErrors = action.payload;
                } else {
                    state.fopaError = action.payload?.message || "Something went wrong!";
                }
            })

            .addCase(verifyPassword.pending, (state) => {
                state.vepaLoading = true;
                state.vepaErrors = null;
                state.vepaError = null;
            })
            .addCase(verifyPassword.fulfilled, (state) => {
                state.vepaLoading = false;
                state.vepaErrors = null;
                state.vepaError = null;
            })
            .addCase(verifyPassword.rejected, (state, action) => {
                state.vepaLoading = false;
                if (Array.isArray(action.payload)) {
                    state.vepaErrors = action.payload;
                } else {
                    state.vepaError = action.payload?.message || "Something went wrong!";
                }
            })

            .addCase(updateProfile.pending, (state) => {
                state.profLoading = true;
                state.profErrors = null;
                state.profError = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.profLoading = false;
                state.profErrors = null;
                state.profError = null;
                state.user = {
                    ...state.user,
                    firstName: action.payload?.profile?.firstName,
                    lastName: action.payload?.profile?.lastName,
                    classOp: action.payload?.profile?.classOp,
                    subjects: action.payload?.profile?.subjects,
                    image: action.payload?.profile?.image
                };
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.profLoading = false;
                if (Array.isArray(action.payload)) {
                    state.profErrors = action.payload;
                } else {
                    state.profError = action.payload?.message || "Something went wrong!";
                }
            })
    },
});

export const { clearErrors, setSignupData, setEmailData, logout } = authSlice.actions;
export default authSlice.reducer;