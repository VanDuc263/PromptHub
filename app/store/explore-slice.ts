import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchExplorePromptsRequest, type ExplorePromptApi } from "@/lib/explore-api";

interface ExploreState {
  prompts: ExplorePromptApi[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ExploreState = { prompts: [], status: "idle", error: null };

export const fetchExplorePrompts = createAsyncThunk(
  "explore/fetchPrompts",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchExplorePromptsRequest();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Could not load prompts.");
    }
  },
);

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExplorePrompts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchExplorePrompts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.prompts = action.payload;
      })
      .addCase(fetchExplorePrompts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const exploreReducer = exploreSlice.reducer;
