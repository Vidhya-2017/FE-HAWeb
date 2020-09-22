import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Menu from '@material-ui/core/Menu';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
));

const CustomiseColumn = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [columns, setColumns] = React.useState(props.columns);
  const { classes, buttonName, disabled } = props
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleListItemClick = (e, item) => {
    const { setViewType } = props
    setViewType(columns)
    handleClose()
  }
  return (
    <React.Fragment>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
        size='small'
        className={classes.button}
        disabled={disabled}
      >
        {buttonName}
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Grid container style={{ padding: '15px' }}>
          {columns.map((item, i) =>
            <Grid key={item.name} item xs={4} sm={3} md={2}>
              <FormControlLabel
                control={<Checkbox checked={item.checked} onChange={() => {
                  columns[i].checked = !item.checked
                  setColumns(columns)
                }} name={item.name} />}
                label={item.title}
              />
            </Grid>
          )}
        </Grid>
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          onClick={handleListItemClick}
        >
          Apply
               </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          onClick={handleClose}
        >
          Cancel
               </Button>
      </StyledMenu>

    </React.Fragment>
  );
}


export default React.memo(CustomiseColumn);