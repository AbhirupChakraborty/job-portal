import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface Job {
  companyName: string;
  jobRole: string;
  maxJdSalary: number;
  minJdSalary: number | null;
  location: string;
  jobDetailsFromCompany: string;
  minExp: number | null;
  maxExp: number;
  logoUrl: string;
}

interface JobCardProps {
  job: Job;
}

const useStyles = makeStyles({
  timeLine: {
    width: '40%',
    border: '0.5px solid #D3D3D3',
    borderRadius: '14px !important',
    padding: 3,
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },  
  jobCard: {
    maxWidth: 400,
    margin: 'auto',
    marginBottom: 20,
    padding: 25,
    border: '0.5px solid #D3D3D3',
    borderRadius: '16px !important',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  companyLogo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  salary: {
    marginTop: 10,
    fontSize: 16,
    color: '#A9A9A9',
  },
  applyButton: {
    width: '100%',
    borderRadius: '6px !important',
    color: 'black !important',
    marginBottom: '8px !important',
    backgroundColor: '#77FDB3 !important',
    '&:hover': {
      backgroundColor: '#77FDB3 !important',
    },
  },
  referralButton: {
    width: '100%',
    borderRadius: '6px !important',
    color: 'white !important',
    backgroundColor: '#3632fb !important',
    '&:hover': {
      backgroundColor: '#3632fb !important',
    },
  }
});
function convertUSDtoINR(usdAmount : number) {
    const exchangeRate = 80;
    return Math.ceil((usdAmount * exchangeRate)/100);
}
function JobCard({ job }: JobCardProps) {
  const classes = useStyles();

  return (
    <Card className={classes.jobCard}>
      <div>
        <div className={classes.timeLine}>⏳ Posted 10 days ago</div>
        <img src={job.logoUrl} alt="logo" className={classes.companyLogo} />
      </div>
      <Typography sx={{ textTransform: 'capitalize' }} variant="h6" gutterBottom>
        {job.companyName}
      </Typography>
      <Typography sx={{ textTransform: 'capitalize' }} variant="subtitle1" gutterBottom>
        {job.jobRole}
      </Typography>
      <Typography sx={{ textTransform: 'capitalize' }} variant="subtitle1" gutterBottom>
        {job.location}
      </Typography>
      <Typography variant="body1" className={classes.salary}>
        Estimated Salary: ₹ {convertUSDtoINR(job.minJdSalary !== null ? job.minJdSalary : 0)} - {convertUSDtoINR(job.maxJdSalary)} LPA ✅
      </Typography>
      <Typography variant="h6" gutterBottom>
        About Company:
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        About us
      </Typography>
      <Typography variant="body2">
        {job.jobDetailsFromCompany}
      </Typography>
      {job.minExp !== null ? (
        <Typography variant="body1">
          Minimum Experience: {job.minExp} years
        </Typography>
      ) : (
        <Typography variant="body1">
          Minimum Experience: Not specified
        </Typography>
      )}
      <div>
      <Button variant="text" className={classes.applyButton} sx= {{textTransform : 'none'}} href="https://weekday.works">
        ⚡Easy Apply
      </Button>
      <Button variant="text" className={classes.referralButton} sx= {{textTransform : 'none'}} href="https://weekday.works">
        Unlock referral asks
      </Button>
      </div>
    </Card>
  );
}

export default JobCard;
