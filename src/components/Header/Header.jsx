import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { SwipeableDrawer, AppBar, Button, Toolbar, Typography, IconButton, MenuItem, Menu } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import DrawerTabs from './DrawerTabs';
import * as actionTypes from "../../common/actionTypes/login.actiontype";
import './scss/Header.scss';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 350,
  },
  brandName: {
    fontSize: 'small',
    paddingLeft: 20
  },
  navbarBrand: {
    fontweight: 500,
    fontSize: 20
  },
  drawerTitle: {
    height: 70,
    background: "#1b91e5",
    color: 'white',
    padding: '20px 10px'
  }
}));
// class Header extends React.Component {
const Header = (props) => {

  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const showSidebar = () => {
    document.getElementsByClassName('sb-nav-fixed')[0].classList.toggle("sb-sidenav-toggled");
    const sidebarClassList = document.getElementsByClassName('sb-nav-fixed')[0].className.split(' ').indexOf("sb-sidenav-toggled");
    document.dispatchEvent(new CustomEvent("sideBarToggled", {
      detail: { sideBarToggled: sidebarClassList }
    }))
  }

  const LogOut = () => {
    props.logout();
    props.history.push('/');
  }
  const goHome = () => {
    console.log('Go to', props)
    if (props.userDetails && props.userDetails.user_id) {
      props.history.push('/home')
    }
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const dataCheck = (open, path) => {
    console.log('-open--', open);
    setDrawerOpen(open);
    props.history.push(path);

  }
  return (
    <div className={classes.root}>
      <AppBar position="fixed" dense>
        <Toolbar>
          <IconButton edge="start" onClick={toggleDrawer(!drawerOpen)} className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <span onClick={goHome} style={{ width: 'auto' }}>
              DiEvA <span className={classes.brandName} >  by DNA Capability  </span>
            </span>
          </Typography>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={LogOut}>LogOut</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <React.Fragment >
        <SwipeableDrawer
          anchor={"left"}
          open={drawerOpen}
          onClose={toggleDrawer(!drawerOpen)}
          onOpen={toggleDrawer(!drawerOpen)}
        >
          <div
            className={classes.list}
            role="presentation"
          >
            <Typography variant="h6" className={classes.drawerTitle}>
              <span onClick={goHome} style={{ width: 'auto' }}>
                DiEvA <span className={classes.brandName} >  by DNA Capability  </span>
              </span>
            </Typography>
            <DrawerTabs history={props.history} drawerOpen={drawerOpen} toggleDrawer={(val, path) => dataCheck(val, path)} />
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  )
}


const logout = () => {
  return async (dispatch) => dispatch({
    type: actionTypes.LOGIN_RES,
    payload: {}
  });
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout())
  };
};

const mapStateToProps = state => (
  {
    userDetails: state.loginReducer.userDetails
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Header);
