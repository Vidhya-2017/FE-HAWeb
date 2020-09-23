import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

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
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));


const CustomiseView = (props) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedMenu, setSelectedMenu] = React.useState();
  const { buttonName, status, setViewType } = props

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleListItemClick = (e, item) => {
    setSelectedMenu(item.id)
    setViewType(item)
    handleClose()
  }


  return (
    <React.Fragment>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="outlined"
        // color="primary"
        style={{minWidth: 120}}
        onClick={handleClick}
        size='small'
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
        {
          status.map((item, i) => {
            return (
              <MenuItem selected={selectedMenu === item.id} onClick={(event) => handleListItemClick(event, item)} key={i}>
                <ListItemText primary={item.title} />
              </MenuItem>
            )
          })
        }
      </StyledMenu>

    </React.Fragment>
  );
}

export default React.memo(CustomiseView);