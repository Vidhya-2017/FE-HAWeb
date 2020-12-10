import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import {TableRow, Paper} from '@material-ui/core';
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: 10
  },
  closeButton: {
    position: 'absolute',
    padding: 8,
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const TableCell = withStyles((theme) => ({
  root: {
    padding: 10,
  },
}))(MuiTableCell);

export default function CustomizedDialogs(props) {
  const [open, setOpen] = React.useState(props.showDailog);

  React.useEffect(() => {
    setOpen(props.showDailog);
  }, [props.showDailog]);

  const handleClose = () => {
    setOpen(false);
    props.handleCloseDialog(false);
  };

  console.log('---props.feedbackList---', props.feedbackList);

  const getFinalStatus = () => {
    const finalStatus = props.feedbackList.find(list => list.sprintLevel === 'Final Assessment');
    let status = "";
    if(finalStatus) {
      status = finalStatus.sq_final_status.toUpperCase();
      let color = "";
      if(finalStatus.sq_final_status === "onhold") {
        color= 'orange';
      } else if(finalStatus.sq_final_status === "rejected") {
        color= 'red';
      } else if(finalStatus.sq_final_status === "selected") {
        color= 'green';
      }
      status = <Typography component="span"> - <span style={{color: color, fontWeight:600}}>{status}</span></Typography>;
    } else {
      status = "";
    }
  return status;
  }
  return (
    <div>
      <Dialog
        TransitionComponent={Transition}
        keepMounted
        fullWidth={true}
        maxWidth={props.feedbackList.length > 0 ? 'md' : 'sm'}
        onClose={handleClose} open={open}>
        <DialogTitle onClose={handleClose}>
          {props.candidateName} Feedback {getFinalStatus()}
        </DialogTitle>
        <DialogContent>
        {props.feedbackList.length === 0 && <Typography color="error" gutterBottom>
            No feedback has been submitted this candidate.
        </Typography> }
          {props.feedbackList.length > 0 && <TableContainer component={Paper}>
            <Table>
              <TableHead style={{background: '#EEEEEE'}}>
                <TableRow>
                  <TableCell>Sprint</TableCell>
                  {props.feedbackList[0].AssesmentParams.map(assessment => 
                    <TableCell key={assessment.ParamName}>{assessment.ParamName}</TableCell>
                    )}
                  <TableCell>Competancy Rating</TableCell>
                  <TableCell>Feedback</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.feedbackList.map((list, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {list.sprintLevel}
                    </TableCell>
                    {list.AssesmentParams.map(assessment => 
                    <TableCell  key={assessment.ParamName}>{assessment.ParamValue}</TableCell>
                    )}
                    <TableCell>{list.competancy_rating ? list.competancy_rating : '--'}</TableCell>
                    <TableCell>{list.feedbackTxt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>}
        </DialogContent>
      </Dialog>
    </div>
  );
}
