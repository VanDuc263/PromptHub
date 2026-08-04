import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchMyPromptsRequest, updatePromptVisibilityRequest, type MyPromptApi } from "@/lib/my-prompts-api";
import type { RootState } from "@/store";
import { logoutUser } from "@/store/auth-slice";
import { createPromptRequest, updatePromptRequest, type CreatePromptPayload, type CreatePromptResult } from "@/lib/create-prompt-api";

interface MyPromptsState {
  prompts: MyPromptApi[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
}

const initialState: MyPromptsState = { prompts: [], status: "idle", error: null, createStatus: "idle", createError: null };

export const fetchMyPrompts = createAsyncThunk<MyPromptApi[], void, { state: RootState; rejectValue: string }>(
  "myPrompts/fetch",
  async (_, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken;
    if (!accessToken) return rejectWithValue("Please sign in to view your prompts.");
    try {
      return await fetchMyPromptsRequest(accessToken);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Could not load your prompts.");
    }
  },
);

export const createPrompt = createAsyncThunk<CreatePromptResult, CreatePromptPayload, { state: RootState; rejectValue: string }>(
  "myPrompts/create",
  async (payload, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken;
    if (!accessToken) return rejectWithValue("Please sign in to create a prompt.");
    try { return await createPromptRequest(payload, accessToken); }
    catch (error) { return rejectWithValue(error instanceof Error ? error.message : "Could not create prompt."); }
  },
);

export const updatePrompt = createAsyncThunk<CreatePromptResult, { promptId: string; payload: CreatePromptPayload }, { state: RootState; rejectValue: string }>(
  "myPrompts/update",
  async ({ promptId, payload }, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken;
    if (!accessToken) return rejectWithValue("Please sign in to update this prompt.");
    try { return await updatePromptRequest(promptId, payload, accessToken); }
    catch (error) { return rejectWithValue(error instanceof Error ? error.message : "Could not update prompt."); }
  },
);

export const updatePromptVisibility = createAsyncThunk<{ promptId: string; visibility: "Private" | "Public" }, { promptId: string; visibility: "Private" | "Public" }, { state: RootState; rejectValue: string }>(
  "myPrompts/updateVisibility",
  async (input, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken;
    if (!accessToken) return rejectWithValue("Please sign in to update this prompt.");
    try {
      await updatePromptVisibilityRequest(input.promptId, input.visibility, accessToken);
      return input;
    } catch (error) { return rejectWithValue(error instanceof Error ? error.message : "Could not change visibility."); }
  },
);

const myPromptsSlice = createSlice({
  name: "myPrompts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPrompts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyPrompts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.prompts = action.payload;
      })
      .addCase(fetchMyPrompts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Could not load your prompts.";
      })
      .addCase(createPrompt.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createPrompt.fulfilled, (state) => {
        state.createStatus = "succeeded";
        state.status = "idle";
      })
      .addCase(createPrompt.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload ?? "Could not create prompt.";
      })
      .addCase(updatePrompt.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(updatePrompt.fulfilled, (state) => {
        state.createStatus = "succeeded";
        state.status = "idle";
      })
      .addCase(updatePrompt.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload ?? "Could not update prompt.";
      })
      .addCase(updatePromptVisibility.fulfilled, (state, action) => {
        const prompt = state.prompts.find((item) => item.id === action.payload.promptId);
        if (prompt) prompt.visibility = action.payload.visibility;
      })
      .addCase(updatePromptVisibility.rejected, (state, action) => {
        state.error = action.payload ?? "Could not change visibility.";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.prompts = [];
        state.status = "idle";
        state.error = null;
        state.createStatus = "idle";
        state.createError = null;
      });
  },
});

export const myPromptsReducer = myPromptsSlice.reducer;
