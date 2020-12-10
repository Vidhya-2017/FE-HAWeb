import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    border: "none",
    "&:not(:first-child)": {
      borderRadius: theme.shape.borderRadius
    },
    "&:first-child": {
      borderRadius: theme.shape.borderRadius
    }
  }
}))(ToggleButtonGroup);

const HoldBtn = withStyles((theme) => ({
  root: {
    margin: 4,
    "&:hover": {
      backgroundColor: "white"
    },
    '&:focus': {
      // outline: 'none',
    },
    "&.Mui-selected": {
      color: "orange",
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "white"
      }
    }
  }
}))(ToggleButton);

const RejectedBtn = withStyles((theme) => ({
  root: {
    margin: 4,
    "&:hover": {
      backgroundColor: "white"
    },
    '&:focus': {
      // outline: 'none',
    },
    "&.Mui-selected": {
      color: "red",
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "white"
      }
    }
  }
}))(ToggleButton);
const SelectedBtn = withStyles((theme) => ({
  root: {
    margin: 4,
    '&:focus': {
      // outline: 'none',
    },
    "&:hover": {
      backgroundColor: "white"
    },
    "&.Mui-selected": {
      color: "green",
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "white"
      },
    }
  }
}))(ToggleButton);

export default function FinalStatusToggle(props) {
  const [status, setStatus] = React.useState("");
  const handleFormat = (event, newStatus) => {
    if (newStatus !== null) {
      setStatus(newStatus);
      props.handleStatusChange(newStatus);
    }
  };

  return (
    <div>
      {props.isFeedBackSubmitted ? <b>{props.finalStatus.toUpperCase()}</b> : <StyledToggleButtonGroup
        size="small"
        value={status}
        exclusive
        onChange={handleFormat}
      >
        <RejectedBtn
          disableFocusRipple
          disableRipple
          value="rejected"
          aria-label="bold"
        >
          <HighlightOffIcon />
        </RejectedBtn>
        <HoldBtn
          disableFocusRipple
          disableRipple
          value="onhold"
          aria-label="italic"
        >
          <PauseCircleOutlineIcon />
        </HoldBtn>
        <SelectedBtn
          disableFocusRipple
          disableRipple
          value="selected"
          aria-label="underlined"
        >
          <CheckCircleOutlineIcon />
        </SelectedBtn>
      </StyledToggleButtonGroup>}
    </div>
  );
}

