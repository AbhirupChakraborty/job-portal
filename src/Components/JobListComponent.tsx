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
    margin: 10,
  },
  container: {
    overflowY: "scroll",
    height: "100vh",
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

 // Filter jobs based on search query and location filter
  const filteredJobs = jobs.filter((job) => {
    const companyMatchesSearch = job.companyName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (locationFilter === null) {
      return companyMatchesSearch;
    }

    if (locationFilter === "onsite") {
      return job.location !== "remote" && companyMatchesSearch;
    }

    return job.location === locationFilter && companyMatchesSearch;
  });

  return (
    <div className={classes.container} ref={containerRef}>
    <TextField
        className={classes.searchInput}
        label="Search Company Name"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
    />
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
