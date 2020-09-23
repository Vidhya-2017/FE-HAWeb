import React, { Fragment } from "react";
import { List, Popper, Paper, Grow, ClickAwayListener, Typography, Toolbar, Checkbox, IconButton, ListItemText, ListItemIcon, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex"
  },
  paper: {
    marginRight: theme.spacing(2)
  },
  columnTitle: {
    flex: "1 1 100%"
  },
  popperRoot: {
    zIndex:10,
  },
  toolbarRoot: {
    paddingLeft: 15
  },
  listroot: {
    width: "100%",
    maxWidth: 300,
    height: 300,
    overflow: "auto",
    backgroundColor: theme.palette.background.paper
  },
  listItemRoot:{
    height: 40
  },
  filterIcon: {
    marginLeft: 10
  }
}));

export default function ViewColumns(props) {
  const { columnData, showHideColumn } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [checked, setChecked] = React.useState([]);

  const handleListToggle = (value) => () => {
    const currentIndex = checked.indexOf(value.id);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value.id);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    showHideColumn(value.id, currentIndex);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = React.useRef(open);

  React.useEffect(() => {
    const selectedColumn = [];
    columnData.forEach(column => {
      if(!column.hide){
        selectedColumn.push(column.id)
      }
      setChecked(selectedColumn);
    })
  }, []);

  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);
  return (
    <div className={classes.root}>
      <div>
        <IconButton
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          onClick={handleToggle}
          aria-haspopup="true"
          className={classes.filterIcon}
        >
          <FilterListIcon />
        </IconButton>
        <ClickAwayListener onClickAway={handleClose}>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          placement="bottom-end"
          disablePortal
          className={classes.popperRoot}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                  <Fragment>
                      <Toolbar disableGutters className={classes.toolbarRoot} variant="dense">
                        <Typography
                          className={classes.columnTitle}
                          component="div"
                        >
                          Columns
                      </Typography>
                        <IconButton onClick={handleClose}>
                          <CloseIcon />
                        </IconButton>
                      </Toolbar>
                    <List className={classes.listroot}>
                      {columnData.map((value) => {
                        return (
                          <ListItem
                            key={value.id}
                            role={undefined}
                            dense
                            button
                            className={classes.listItemRoot}
                            onClick={handleListToggle(value)}
                          >
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={checked.indexOf(value.id) !== -1}
                                // checked={value.hide}
                                tabIndex={-1}
                                disableRipple
                              />
                            </ListItemIcon>
                            <ListItemText primary={value.label} />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Fragment>
              </Paper>
            </Grow>
          )}
        </Popper>
        </ClickAwayListener>
      </div>
    </div>
  );
}
