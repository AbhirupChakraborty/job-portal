import { useState, useEffect, useRef, useCallback } from "react";
import JobCard from "./JobCard";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import JobFilters from "./JobFilters";

const BUFFER_VALUE = 100;
const exchangeRate = 80;

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
  const [jobs, setJobs] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [minExpFilter, setMinExpFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [minSalaryFilter, setMinSalaryFilter] = useState<string | null>(null);
  const [availableMinSalaries, setAvailableMinSalaries] = useState<number[]>([]);

  const fetchData = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 10, offset }), // Send the current offset
      };
      const response = await fetch(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const convertedJobs = data.jdList?.map((job : any) => ({
        ...job,
        minJDSalaryInLPA: Math.ceil((job.minJDSalary * exchangeRate) / 100),
      }));
      setJobs((prevJobs) => [...prevJobs, ...(data.jdList || [])]);
      setOffset(offset + 10); // Increment offset for the next fetch
      // Extract and store minJDSalary data
      const salaries = convertedJobs.jdList.map((job: any) => job.minJDSalaryInLPA);
      setAvailableMinSalaries(salaries);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch initial data only once

  const handleScroll = useCallback(async () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    // Check if scrolled to the bottom of the container with a buffer
    if (scrollTop + clientHeight >= scrollHeight - BUFFER_VALUE) {
      await fetchData();
    }
  }, [containerRef]);
  
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Determine unique roles from the jobs in the viewport
  useEffect(() => {
    const rolesInView = Array.from(
      new Set(jobs.map((job) => job.jobRole))
    );
    setAvailableRoles(rolesInView);
  }, [jobs]);

  useEffect(() => {
    // Determine unique locations from the jobs in the viewport
    const locationsInView = Array.from(
      new Set(jobs.map((job) => job.location))
    );
    setAvailableLocations(locationsInView);
  }, [jobs]);

  // Filter jobs based on search query, location filter, minimum experience filter, and role filter
  const filteredJobs = jobs.filter((job) => {
    const companyMatchesSearch = job.companyName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const locationMatchesFilter =
      locationFilter === null || locationFilter === job.location;

    const minExpMatchesFilter =
      minExpFilter === null ||
      (minExpFilter === "fresher" && (job.minExp === 0 || job.minExp === 1)) ||
      (minExpFilter === "more_than_1" && job.minExp > 1) ||
      (minExpFilter === "more_than_2" && job.minExp > 2) ||
      (minExpFilter === "more_than_5" && job.minExp > 5) ||
      (minExpFilter === "not_specified" && job.minExp === null);

    const minSalaryMatchesFilter =
      minSalaryFilter === null ||
      (minSalaryFilter === "below_5lpa" && job.minJDSalary < 5) ||
      (minSalaryFilter === "5lpa_to_10lpa" && job.minJDSalary >= 5 && job.minJDSalary < 10) ||
      (minSalaryFilter === "10lpa_to_20lpa" && job.minJDSalary >= 10 && job.minJDSalary < 20) ||
      (minSalaryFilter === "above_20lpa" && job.minJDSalary >= 20);

    const roleMatchesFilter =
      roleFilter === null || roleFilter === job.jobRole;

    return (
      companyMatchesSearch &&
      locationMatchesFilter &&
      minExpMatchesFilter &&
      roleMatchesFilter &&
      minSalaryMatchesFilter
    );
  });

  return (
    <div className={classes.root}>
      <div className={classes.filtersContainer}>
        <JobFilters
          locationFilter={locationFilter}
          minExpFilter={minExpFilter}
          roleFilter={roleFilter}
          availableLocations={availableLocations}
          availableRoles={availableRoles}
          onLocationFilterChange={setLocationFilter}
          onMinExpFilterChange={setMinExpFilter}
          onRoleFilterChange={setRoleFilter}
          minSalaryFilter={minSalaryFilter}
          availableMinSalaries={availableMinSalaries}
          onMinSalaryFilterChange={setMinSalaryFilter}
        />
        <TextField
          className={classes.searchInput}
          label="Search Company Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className={classes.jobListContainer} ref={containerRef}>
        {filteredJobs.map((job, index) => (
          <div key={index} className={classes.jobCard}>
            <JobCard job={job} />
          </div>
        ))}
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}

export default JobsComponent;