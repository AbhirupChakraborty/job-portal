import { useState, useEffect, useRef } from "react";
import JobCard from "./JobCard";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    listStyle: "none",
    padding: 0,
    gap: 15,
    margin: 15,
  },
  container: {
    overflowY: "scroll",
    height: "calc(100vh - 20px)",
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

  const fetchData = async () => {
    try {
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
      setJobs((prevJobs) => [...prevJobs, ...(data.jdList || [])]);
      setOffset(offset + 10); // Increment offset for the next fetch
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch initial data only once

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
      // Check if scrolled to the bottom of the container
      if (scrollHeight - scrollTop === clientHeight) {
        fetchData(); // Fetch more data when scrolled to the bottom
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    // Cleanup event listener
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [jobs]); // Re-add event listener when jobs change

  // Determine unique roles from the jobs in the viewport
  const rolesInView = Array.from(
    new Set(
      jobs.map((job) => job.jobRole) // Assuming "role" is the field for role in job data
    )
  );

  // Filter jobs based on search query, location filter, minimum experience filter, and role filter
  const filteredJobs = jobs.filter((job) => {
    const companyMatchesSearch = job.companyName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const locationMatchesFilter =
      locationFilter === null ||
      (locationFilter === "remote" && job.location === "remote") ||
      (locationFilter === "onsite" && job.location !== "remote");

    const minExpMatchesFilter =
      minExpFilter === null ||
      (minExpFilter === "fresher" && (job.minExp === 0 || job.minExp === 1)) ||
      (minExpFilter === "more_than_1" && job.minExp > 1) ||
      (minExpFilter === "more_than_2" && job.minExp > 2) ||
      (minExpFilter === "more_than_5" && job.minExp > 5) ||
      (minExpFilter === "not_specified" && job.minExp === null);

    const roleMatchesFilter =
      roleFilter === null || roleFilter === job.jobRole;

    return (
      companyMatchesSearch &&
      locationMatchesFilter &&
      minExpMatchesFilter &&
      roleMatchesFilter
    );
  });

  return (
    <div className={classes.container} ref={containerRef}>
      <TextField
        select
        label="Location Filter"
        variant="outlined"
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
        className={classes.searchInput}
      >
        <MenuItem value="remote">Remote</MenuItem>
        <MenuItem value="onsite">Onsite</MenuItem>
      </TextField>
      <TextField
        select
        label="Minimum Experience Filter"
        variant="outlined"
        value={minExpFilter}
        onChange={(e) => setMinExpFilter(e.target.value)}
        className={classes.searchInput}
      >
        <MenuItem value="fresher">Fresher</MenuItem>
        <MenuItem value="more_than_1">More than 1 years</MenuItem>
        <MenuItem value="more_than_2">More than 2 years</MenuItem>
        <MenuItem value="more_than_5">More than 5 years</MenuItem>
        <MenuItem value="not_specified">Not Specified</MenuItem>
      </TextField>
      <TextField
        select
        label="Role Filter"
        variant="outlined"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className={classes.searchInput}
      >
        {rolesInView.map((jobRole) => (
          <MenuItem key={jobRole} value={jobRole}>
            {jobRole}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        className={classes.searchInput}
        label="Search Company Name"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul className={classes.root}>
        {filteredJobs.map((job, index) => (
          <li key={index}>
            <JobCard job={job} />
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default JobsComponent;
