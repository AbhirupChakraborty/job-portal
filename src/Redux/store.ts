import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from './reducers/jobsSlice';

const store = configureStore({
  reducer: {
    jobs: jobsReducer,
  },
});

export default store;