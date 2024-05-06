import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { setLocationFilter, setMinExpFilter, setRoleFilter, setMinJDSalaryFilter, selectLocationFilter, selectMinExpFilter, selectRoleFilter, selectMinJDSalaryFilter, selectFilteredJobs } from "../Redux/reducers/jobsSlice";

const useStyles = makeStyles({
  searchInput: {
    display: 'flex',
    flexDirection: 'row',
    flexFlow: 'column',
    marginBottom: 10,
    width: 150,
  },
  filters:{
    display: 'flex',
    gap: 15,
    maxHeight: "calc(100vh - 10px)",
  },
});

const JobFilters = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const locationFilter = useSelector(selectLocationFilter);
  const minExpFilter = useSelector(selectMinExpFilter);
  const roleFilter = useSelector(selectRoleFilter);
  const minJDSalaryFilter = useSelector(selectMinJDSalaryFilter);
  const filteredJobs = useSelector(selectFilteredJobs);

  const availableLocations = Array.from(
    new Set(filteredJobs.map((job) => job.location))
  );

  const availableRoles = Array.from(
    new Set(filteredJobs.map((job) => job.jobRole))
  );

  return (
    <div className={classes.filters}>
      <TextField
        select
        label="Remote"
        variant="outlined"
        value={locationFilter}
        onChange={(e) => dispatch(setLocationFilter(e.target.value))}
        className={classes.searchInput}
      >
        {availableLocations.map((location) => (
          <MenuItem key={location} value={location}>
            {location}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Experience"
        variant="outlined"
        value={minExpFilter}
        onChange={(e) => dispatch(setMinExpFilter(e.target.value))}
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
        label="Roles"
        variant="outlined"
        value={roleFilter}
        onChange={(e) => dispatch(setRoleFilter(e.target.value))}
        className={classes.searchInput}
      >
        {availableRoles.map((jobRole) => (
            <MenuItem key={jobRole} value={jobRole}>
                {jobRole}
            </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Min Base Pay"
        variant="outlined"
        value={minJDSalaryFilter}
        onChange={(e) => dispatch(setMinJDSalaryFilter(e.target.value))}
        className={classes.searchInput}
      >
        <MenuItem value="below_5lpa">Below 5 LPA</MenuItem>
        <MenuItem value="5lpa_to_10lpa">5 LPA to 10 LPA</MenuItem>
        <MenuItem value="10lpa_to_20lpa">10 LPA to 20 LPA</MenuItem>
        <MenuItem value="above_20lpa">Above 20 LPA</MenuItem>
      </TextField>
    </div>
  );
};

export default JobFilters;
