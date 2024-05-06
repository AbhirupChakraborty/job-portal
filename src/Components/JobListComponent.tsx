import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {ThunkDispatch} from "@reduxjs/toolkit";
import { fetchJobs, selectFilteredJobs, selectLoading, selectSearchQuery } from "../Redux/reducers/jobsSlice";
import JobCard from "./JobCard";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import JobFilters from "./JobFilters";

const BUFFER_VALUE = 100;

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    margin: 15,
  },
  filtersContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    maxHeight: "calc(100vh - 20px)",
  },
  jobListContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  },
  jobCard: {
    width: "100%",
  },
  searchInput: {
    marginBottom: 10,
  },
});

function JobsComponent() {
  const classes = useStyles();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const jobs = useSelector(selectFilteredJobs);
  const loading = useSelector(selectLoading);
  const searchQuery = useSelector(selectSearchQuery);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleScroll = useCallback(async () => {
    if (!containerRef.current || loading) return;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - BUFFER_VALUE) {
      dispatch(fetchJobs());
    }
  }, [containerRef, loading, dispatch]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className={classes.root}>
      <div className={classes.filtersContainer}>
        <JobFilters />
        <TextField
          className={classes.searchInput}
          label="Search Company Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => dispatch(searchQuery(e.target.value))}
        />
      </div>
      <div className={classes.jobListContainer} ref={containerRef}>
        {jobs.map((job : any) => (
          <div className={classes.jobCard}>
            <JobCard job={job} />
          </div>
        ))}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}

export default JobsComponent;
