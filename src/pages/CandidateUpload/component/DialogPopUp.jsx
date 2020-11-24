import React, { useEffect, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import { CandidateUploadActions } from '../modules/CandidateUploadActions';
import Autocomplete from '@material-ui/lab/Autocomplete';
import '../scss/CandidateUpload.scss';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogPopUp({ showDialog, closeDialog, handleSubmit }) {
  const [open, setOpen] = React.useState(showDialog);
  const [eventList, setEventList] = React.useState([]);
  const [eventData, SetEventData] = React.useState([]);
  const [eventID, setEventID] = React.useState('');

  useEffect(() => {
    CandidateUploadActions.getEventList().then(response => {
      if (response && response.arrRes) {
        setEventList(response.arrRes);
      }
    });
  }, []);

  useEffect(() => {
    setOpen(showDialog)
  }, [showDialog]);

  const handleClose = () => {
    closeDialog(false);
    setOpen(false);
    SetEventData([]);
    setEventID('');
  };


  const handleChange = (newValue) => {
    setEventID(newValue);
    if (newValue) {
      const req = { EventID: newValue.EventId };
      CandidateUploadActions.getEventByUser(req).then((response) => {
        if (response && response.arrRes) {
          SetEventData(response.arrRes[0]);
        }
      })
    }
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        className="dialog"
        disableBackdropClick
        disableEscapeKeyDown
        fullWidth={true}
        maxWidth={'xs'}
        onClose={handleClose}
      >
        <DialogTitle>{"Select the Event"}</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography style={{ padding: '10px 0 12px' }}>Event Name</Typography>
            <Autocomplete
              id="combo-box-demo"
              options={eventList}
              value={eventID}
              getOptionLabel={(option) => option.Name || option}
              style={{ width: 200 }}
              size="small"
              onChange={(event, newValue) => handleChange(newValue)}
              renderInput={(params) => <TextField {...params} label="Events" variant="outlined" />}
            />
          </div>
          {eventData && eventData.EventDate &&
            <Fragment>
              <div className='eventData'>
                <span className='eventTitle'>Event Date:</span>
                <span className='scoreTextLabel'>{moment(eventData.EventDate).format("DD-MM-YYYY")}</span>
              </div>
              <div className='eventData'>
                <span className='eventTitle'>Event Skills:</span>
                <span className='scoreTextLabel'>{eventData.skillname.join(', ')}</span>
              </div>
            </Fragment>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => { handleClose(); handleSubmit(eventData) }} disabled={eventID && eventID.EventID === ''} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

