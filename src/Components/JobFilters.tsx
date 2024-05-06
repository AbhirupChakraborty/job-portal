import React from "react";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

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

interface JobFiltersProps {
    locationFilter: string | null;
    minExpFilter: string | null;
    roleFilter: string | null;
    availableLocations: string[];
    availableRoles: string[];
    onLocationFilterChange: (value: string | null) => void;
    onMinExpFilterChange: (value: string | null) => void;
    onRoleFilterChange: (value: string | null) => void;
    minSalaryFilter: string | null;
    availableMinSalaries: number[];
    onMinSalaryFilterChange: (value: string | null) => void;
  }

const JobFilters: React.FC<JobFiltersProps> = ({
  locationFilter,
  minExpFilter,
  roleFilter,
  availableLocations,
  availableRoles,
  minSalaryFilter,
  availableMinSalaries,
  onLocationFilterChange,
  onMinExpFilterChange,
  onRoleFilterChange,
  onMinSalaryFilterChange,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.filters}>
      <TextField
        select
        label="Remote"
        variant="outlined"
        value={locationFilter}
        onChange={(e) => onLocationFilterChange(e.target.value)}
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
        onChange={(e) => onMinExpFilterChange(e.target.value)}
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
        onChange={(e) => onRoleFilterChange(e.target.value)}
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
        value={minSalaryFilter}
        onChange={(e) => onMinSalaryFilterChange(e.target.value)}
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
