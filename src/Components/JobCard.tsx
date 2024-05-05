import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import StyledBadge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar'; 
import Stack from '@mui/material/Stack';

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
    width: '150px',
    border: '0.5px solid #D3D3D3',
    borderRadius: '14px !important',
    padding: 3,
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },  
  jobCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Added to make content side by side
    maxWidth: 350,
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
    marginRight: 20, 
  },
  companyInfo: {
    textTransform: 'capitalize',
    marginBottom: 5, 
  },
  jobInfo: {
    display: 'flex',
    flexDirection: 'row',
  },
  salary: {
    marginTop: 10,
    fontSize: 16,
    color: '#A9A9A9',
  },
  jobDetails: {
    '&:after, &:before': {
      boxSizing: 'inherit',
    },
  },
  description: {
    maskImage: 'linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255), rgba(255, 255, 255, 0))',
    cursor: 'pointer',
  },
  viewJob: {
    color: 'blue',
    textTransform: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    marginLeft: '40%',
    paddingBottom: '30%'
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
  avatar: {
    width: '25px !important',
    height: '25px !important',
    wordSpacing: '5px',
    border: '1px solid black',
  },
  referralButton: {
    width: '100%',
    borderRadius: '6px !important',
    color: 'white !important',
    backgroundColor: '#3632fb !important',
    '&:hover': {
      backgroundColor: '#3632fb !important',
    },
  },
});

function convertUSDtoINR(usdAmount: number) {
  const exchangeRate = 80;
  return Math.ceil((usdAmount * exchangeRate) / 100);
}

function JobCard({ job }: JobCardProps) {
  const classes = useStyles();

  return (
  <Card className={classes.jobCard}>
    <div className={classes.timeLine}>⏳ Posted 10 days ago</div>
    <div className={classes.jobInfo}>
      <div>
        <img src={job.logoUrl} alt="logo" className={classes.companyLogo} />
      </div>
      <div style={{ marginLeft: '16px' }}>
        <Typography className={classes.companyInfo} sx={{ fontWeight: 'bold', color: 'grey' }} variant="subtitle1" gutterBottom>
          {job.companyName}
        </Typography>
        <Typography className={classes.companyInfo} sx={{ fontWeight: 400 }} variant="subtitle1" gutterBottom>
          {job.jobRole} Engineer
        </Typography>
        <Typography className={classes.companyInfo} sx={{ fontWeight: 500 }} variant="subtitle1" gutterBottom>
          {job.location}
        </Typography>
      </div>
    </div>
    <div style={{ marginTop: '16px' }}>
      <Typography variant="body1" className={classes.salary}>
        Estimated Salary: ₹ {convertUSDtoINR(job.minJdSalary !== null ? job.minJdSalary : 0)} - {convertUSDtoINR(job.maxJdSalary)} LPA ✅
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 500, color: '#5A5A5A', marginTop: '16px' }} gutterBottom>
        About Company:
      </Typography>
      <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1" gutterBottom>
        About us
      </Typography>
      <p className={classes.jobDetails}>
        <Typography className={classes.description} variant="body2">
          <span>{job.jobDetailsFromCompany}</span>
        </Typography>
        <span className={classes.viewJob}> View Job </span>
      </p>
      {job.minExp !== null ? (
      <>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'grey', marginTop: '16px' }}>
          Minimum Experience:
        </Typography>
        <p>{job.minExp} years</p>
      </>
      ) : (
      <>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'grey', marginTop: '16px' }}>
          Minimum Experience:
        </Typography>
        <p> Not specified </p>
      </>
      )}
    <div>
      <Button variant="text" className={classes.applyButton} sx={{ fontWeight: '700', textTransform: 'none' }} href="https://weekday.works">
        ⚡Easy Apply
      </Button>
      <Button variant="text" className={classes.referralButton} sx={{ textTransform: 'none' }} href="https://weekday.works">
        <Stack direction="row" spacing={2}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar className={classes.avatar} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </StyledBadge>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar className={classes.avatar} alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          </StyledBadge>
        </Stack>
        Unlock referral asks
      </Button>
    </div>
    </div>
  </Card>
  );
}

export default JobCard;
