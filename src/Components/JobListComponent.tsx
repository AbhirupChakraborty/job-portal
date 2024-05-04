import { useState, useEffect } from "react";
import JobCard from "./JobCard";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    listStyle: "none",
    padding: 0,
  },
});

function JobsComponent() {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ limit: 10, offset: 0 }),
        };
        const response = await fetch(
          "https://api.weekday.technology/adhoc/getSampleJdJSON",
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setJobs(data.jdList || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <ul className={classes.root}>
        {jobs.map((job) => (
          <li>
            <JobCard job={job} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobsComponent;
