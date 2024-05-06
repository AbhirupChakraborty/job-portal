import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  offset: 0,
  loading: false,
  searchQuery: '',
  locationFilter: null,
  minExpFilter: null,
  roleFilter: null,
  availableLocations: [],
  availableRoles: [],
  minJDSalaryFilter: null,
  exchangeRate: 0,
  error: null, // Optional: Add an error state for handling errors
};

const exchangeRate = 80;
// Create an async thunk action to fetch data
export const fetchJobs = createAsyncThunk(
    'jobs/fetchJobs',
    async (params, { getState }) => {
      const { offset, searchQuery, locationFilter, minExpFilter, roleFilter, minJDSalaryFilter } = getState().jobs;
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          limit: 10,
          offset,
          searchQuery,
          locationFilter,
          minExpFilter,
          roleFilter,
          minJDSalaryFilter,
        }),
      };
      const response = await fetch('https://api.weekday.technology/adhoc/getSampleJdJSON', requestOptions);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const convertedJobs = data.jdList?.map((job) => ({
        ...job,
        minJDSalaryInLPA: Math.floor(job.minJDSalary * exchangeRate / 100000), // Convert USD to LPA (rounded down)
      }));
      return convertedJobs;
    }
  );

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setLocationFilter(state, action) {
      state.locationFilter = action.payload;
    },
    setMinExpFilter(state, action) {
      state.minExpFilter = action.payload;
    },
    setRoleFilter(state, action) {
      state.roleFilter = action.payload;
    },
    setMinJDSalaryFilter(state, action) {
      state.minJDSalaryFilter = action.payload;
    },
    setExchangeRate(state, action) {
      state.exchangeRate = action.payload;
    },
    setError(state, action) { // Optional: Add error handling
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on pending fetch
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = [...state.jobs, ...action.payload];
        state.offset += 10;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Selectors for cleaner component access to state
export const selectJobs = (state) => state.jobs.jobs; // Access filtered jobs
export const selectFilteredJobs = (state) => {
  const allJobs = state.jobs.jobs;
  const searchQuery = state.jobs.searchQuery.toLowerCase();
  const locationFilter = state.jobs.locationFilter;
  const minExpFilter = state.jobs.minExpFilter;
  const roleFilter = state.jobs.roleFilter;
  const minJDSalaryFilter = state.jobs.minJDSalaryFilter;

  return allJobs.filter((job) => {
    const companyMatchesSearch = job.companyName.toLowerCase().includes(searchQuery);
    const locationMatchesFilter = locationFilter === null || locationFilter === job.location;
    const minExpMatchesFilter =
      minExpFilter === null ||
      (minExpFilter === 'fresher' && (job.minExp === 0 || job.minExp === 1)) ||
      (minExpFilter === 'more_than_1' && job.minExp > 1) ||
      (minExpFilter === 'more_than_2' && job.minExp > 2) ||
      (minExpFilter === 'more_than_5' && job.minExp > 5) ||
      (minExpFilter === 'not_specified' && job.minExp === null);
    const minSalaryMatchesFilter =
      minJDSalaryFilter === null ||
      (minJDSalaryFilter === 'below_5lpa' && job.minJDSalary < 5) ||
      (minJDSalaryFilter === '5lpa_to_10lpa' && job.minJDSalary >= 5 && job.minJDSalary < 10) ||
      (minJDSalaryFilter === '10lpa_to_20lpa' && job.minJDSalary >= 10 && job.minJDSalary < 20) ||
      (minJDSalaryFilter === 'above_20lpa' && job.minJDSalary >= 20);
    
    const roleMatchesFilter = roleFilter === null || roleFilter === job.jobRole;
    
    return (
      companyMatchesSearch &&
      locationMatchesFilter &&
      minExpMatchesFilter &&
      roleMatchesFilter &&
      minSalaryMatchesFilter
    );
    })
};
    
export const selectLoading = (state) => state.jobs.loading;
export const selectSearchQuery = (state) => state.jobs.searchQuery;
export const selectLocationFilter = (state) => state.jobs.locationFilter;
export const selectMinExpFilter = (state) => state.jobs.minExpFilter;
export const selectRoleFilter = (state) => state.jobs.roleFilter;
export const selectMinJDSalaryFilter = (state) => state.jobs.minJDSalaryFilter;
export const selectError = (state) => state.jobs.error; // Optional: Access error state

export default jobsSlice.reducer;