import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {IconButton} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
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
      <IconButton onClick={handleClick} >
        <ViewModuleIcon/>
      </IconButton>
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