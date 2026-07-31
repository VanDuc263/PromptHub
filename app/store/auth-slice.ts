import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  clearSession,
  loadSession,
  loginRequest,
  persistSession,
  registerRequest,
  usernameAvailabilityRequest,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "@/lib/auth-api";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";
export type UsernameStatus = "idle" | "checking" | "available" | "taken" | "error";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  status: RequestStatus;
  error: string | null;
  usernameStatus: UsernameStatus;
  usernameQuery: string;
  usernameRequestId: string | null;
}

const restoredSession = loadSession();
const initialState: AuthState = {
  accessToken: restoredSession?.accessToken ?? null,
  user: restoredSession?.user ?? null,
  status: "idle",
  error: null,
  usernameStatus: "idle",
  usernameQuery: "",
  usernameRequestId: null,
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await loginRequest(payload);
      persistSession({ accessToken: response.accessToken, user: response.user }, payload.remember);
      return response;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await registerRequest(payload);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const checkUsername = createAsyncThunk(
  "auth/checkUsername",
  async (username: string, { rejectWithValue }) => {
    try {
      return { username, available: await usernameAvailabilityRequest(username) };
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  clearSession();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
      if (state.status === "failed") state.status = "idle";
    },
    resetUsernameCheck(state) {
      state.usernameStatus = "idle";
      state.usernameQuery = "";
      state.usernameRequestId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(checkUsername.pending, (state, action) => {
        state.usernameStatus = "checking";
        state.usernameQuery = action.meta.arg;
        state.usernameRequestId = action.meta.requestId;
      })
      .addCase(checkUsername.fulfilled, (state, action) => {
        if (state.usernameRequestId !== action.meta.requestId) return;
        state.usernameStatus = action.payload.available ? "available" : "taken";
        state.usernameRequestId = null;
      })
      .addCase(checkUsername.rejected, (state, action) => {
        if (state.usernameRequestId !== action.meta.requestId) return;
        state.usernameStatus = "error";
        state.usernameRequestId = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.accessToken = null;
        state.user = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { clearAuthError, resetUsernameCheck } = authSlice.actions;
export const authReducer = authSlice.reducer;
