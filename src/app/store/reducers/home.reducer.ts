
import {
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { delay } from 'app/helpers/system.helpter';

interface InitialState {
  // movies: TMovie[]
  favorite: TMovie[]
  booking: TMovie[]
  // loading: boolean
  movie_reload_home?: TMovie
}

export const initialState: InitialState = {
  // loading: false,
  // movies: [],
  favorite: [],
  booking: [],
  movie_reload_home: undefined
};

interface QueryMovie {
  page?: number,
  limit?: number
}

// export const getListMovie = createAsyncThunk(
//   "home/getListMovie",
//   async ({ page = 1, limit = 20 }: QueryMovie) => {
//     return data.slice((page - 1) * limit, page * limit)
//   }
// );

// export const getListTrendingMovie = createAsyncThunk(
//   "home/getListTrendingMovie",
//   async () => {
//     await delay(1000);
//     return data.slice(50, 80)
//   }
// );

export const addMovieToFavorite = createAsyncThunk(
  "home/addMovieToFavorite",
  async (movie: TMovie) => {
    // const _newData = data.find(i => i.id === movie.id)?.is_favorite || false

    // return {
    //   ...movie,
    //   is_favorite: !_newData
    // }

    return movie
  }
);


export const home = createSlice({
  name: 'home',
  initialState: initialState,
  reducers: {

  },
  extraReducers(builder) {
    builder
      // .addCase(getListMovie.pending, (state, action) => {
      //   state.loading = true
      // })
      // .addCase(getListMovie.fulfilled, (state, action) => {
      //   if (action.meta.arg.page === 1) {
      //     state.movies = action.payload
      //   } else {
      //     state.movies = [...state.movies, ...action.payload]
      //   }
      //   state.loading = false
      // })
      // .addCase(getListMovie.rejected, (state, action) => {
      //   state.loading = false
      // })
      .addCase(addMovieToFavorite.fulfilled, (state, action) => {
        if (action.payload.is_favorite) {
          state.favorite = [action.payload, ...state.favorite.filter(i => i.id !== action.payload.id)]
        } else {
          state.favorite = state.favorite.filter(i => i.id !== action.payload.id)
        }
      })
  },
});

// Reducer
export const { } = home.actions;
export default home.reducer;
