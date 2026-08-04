import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSavedPromptsRequest, removeSavedPromptRequest, type SavedPromptApi } from "@/lib/saved-prompts-api";
import type { RootState } from "@/store";
import { logoutUser } from "@/store/auth-slice";

interface SavedPromptsState {
  prompts: SavedPromptApi[];
  status: "idle" | "loading" | "succeeded" | "failed";
  mutationStatus: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: SavedPromptsState = { prompts: [], status: "idle", mutationStatus: "idle", error: null };

export const fetchSavedPrompts = createAsyncThunk<SavedPromptApi[], void, { state: RootState; rejectValue: string }>(
  "savedPrompts/fetch",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.accessToken;
    if (!token) return rejectWithValue("Please sign in to view saved prompts.");
    try { return await fetchSavedPromptsRequest(token); }
    catch (error) { return rejectWithValue(error instanceof Error ? error.message : "Could not load saved prompts."); }
  },
);

export const removeSavedPrompts = createAsyncThunk<string[], string[], { state: RootState; rejectValue: string }>(
  "savedPrompts/remove",
  async (promptIds, { getState, rejectWithValue }) => {
    const token = getState().auth.accessToken;
    if (!token) return rejectWithValue("Please sign in again.");
    try {
      await Promise.all(promptIds.map((id) => removeSavedPromptRequest(id, token)));
      return promptIds;
    } catch (error) { return rejectWithValue(error instanceof Error ? error.message : "Could not remove saved prompts."); }
  },
);

const savedPromptsSlice = createSlice({
  name: "savedPrompts",
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchSavedPrompts.pending, (state) => { state.status = "loading"; state.error = null; })
    .addCase(fetchSavedPrompts.fulfilled, (state, action) => { state.status = "succeeded"; state.prompts = action.payload; })
    .addCase(fetchSavedPrompts.rejected, (state, action) => { state.status = "failed"; state.error = action.payload ?? "Could not load saved prompts."; })
    .addCase(removeSavedPrompts.pending, (state) => { state.mutationStatus = "loading"; state.error = null; })
    .addCase(removeSavedPrompts.fulfilled, (state, action) => {
      state.mutationStatus = "idle";
      state.prompts = state.prompts.filter((prompt) => !action.payload.includes(prompt.id));
    })
    .addCase(removeSavedPrompts.rejected, (state, action) => { state.mutationStatus = "failed"; state.error = action.payload ?? "Could not remove saved prompts."; })
    .addCase(logoutUser.fulfilled, () => initialState),
});

export const savedPromptsReducer = savedPromptsSlice.reducer;
