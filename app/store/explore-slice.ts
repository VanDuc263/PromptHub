import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchExplorePromptsRequest, fetchPromptDetailRequest, type ExplorePromptApi } from "@/lib/explore-api";

interface ExploreState {
  prompts: ExplorePromptApi[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedPrompt: ExplorePromptApi | null;
  detailStatus: "idle" | "loading" | "succeeded" | "failed";
  detailError: string | null;
}

const initialState: ExploreState = {
  prompts: [], status: "idle", error: null,
  selectedPrompt: null, detailStatus: "idle", detailError: null,
};

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

export const fetchPromptDetail = createAsyncThunk(
  "explore/fetchPromptDetail",
  async (promptId: string, { rejectWithValue }) => {
    try {
      return await fetchPromptDetailRequest(promptId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Could not load prompt.");
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
      })
      .addCase(fetchPromptDetail.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchPromptDetail.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.selectedPrompt = action.payload;
      })
      .addCase(fetchPromptDetail.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload as string;
      });
  },
});

export const exploreReducer = exploreSlice.reducer;
