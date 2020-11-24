import React, {useEffect} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars({showSnackbar, closeSnackbar, severity, toastMessage}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(showSnackbar);
  const [severities, setSeverities] = React.useState(severity);
  const [toastMsg, settoastMessage] = React.useState(toastMessage);
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    closeSnackbar(false);
    setOpen(false);
  };
  useEffect(() => {setOpen(showSnackbar)}, [showSnackbar]);
  useEffect(() => {setSeverities(severity)}, [severity]);
  useEffect(() => {settoastMessage(toastMessage)}, [toastMessage]);

  return (
    <div className={classes.root}>
      <Snackbar open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severities}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </div>
  );
}
