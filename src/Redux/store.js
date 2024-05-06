import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from './reducers/jobsSlice'; // Replace with the path to your reducer

const store = configureStore({
  reducer: {
    jobs: jobsReducer,
  },
});

export default store;