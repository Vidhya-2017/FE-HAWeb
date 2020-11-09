import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { AppBar, ListItem, List, ListItemText, Tabs, Tab, Typography, Box } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 350,
  },
  tabBtn: {
    minWidth: 100,
    maxWidth: 116,
    width: 116
  },
  accDetails: {
    display: 'block',
    padding: '0'
  }
}));

const hackeranchorDashBoard = [
  { text: 'Event Details', path: '/home' },
  { text: 'Event Status', path: '/eventStatus' },
  { text: 'Squad Report', path: '/squadReport' },
  { text: 'Event Report', path: '/eventReport' },
];

const hackeranchorRegEvent = [
  { text: 'Event Registration', path: '/eventRegister' },
  { text: 'Candidate Upload', path: '/candidateUpload' },
  { text: 'Candidate Selection', path: '/candidateSelection' },
]


const hackeranchorManageEvent = [
  { text: 'Event Co-Ordinator', path: '/eventCoordinator' },
  { text: 'Squad Formation', path: '/squadFormation' },
  { text: 'Candidate Feedback', path: '/candidateFeedback' },
  { text: 'Event Feedback', path: '/eventFeedback' },
  { text: 'Event List', path: '/eventList' },
]


const demandPaths = [

  { text: 'Demand Dashboard', path: '/demandDashboard' },
  { text: 'Demand Supply', path: '/demand' },
  { text: 'Add SPOC', path: '/addSPOC' },
  { text: 'Add Recuriter', path: '/addRecruiter' },
  { text: 'Company List', path: '/previousEmpolyer' },
  { text: 'Panel', path: '/panel' },
];

const trainingPaths = [
  { text: 'Training Registration', path: '/trainingCreation' },
  { text: 'Candidate Selection', path: '/TFCandidateSelection' },
  { text: 'SME Covered Topics', path: '/smeTopicsCovered' },
  { text: 'Candidate Feedback', path: '/candidateFeedbackList' },
];

const trainingMorePaths = [
  { text: 'Users', path: '/user' },
  { text: 'Skills', path: '/skill' },
  { text: 'Assessment Scale', path: '/assesmentType' },
  { text: 'Training Type', path: '/trainingType' },
  { text: 'Training List', path: '/trainingList' },
  { text: 'Duration List', path: '/durationMaster' },
  { text: 'LOB', path: '/lob' }
];

const selectedStyle = {
  borderLeft: 'solid #2196F3',
  background: '#87cefa3d'
}
const DrawerTabs = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const selectedTab = window.sessionStorage.getItem('selectedTab');
  const selectedPanel = window.sessionStorage.getItem('selectedPanel');
  const [value, setValue] = React.useState(selectedTab ? parseInt(selectedTab) : 0);
  const [drawerOpen, setDrawerOpen] = React.useState(props.drawerOpen);
  const [expanded, setExpanded] = React.useState(selectedPanel ? selectedPanel : 'panel1');

  const handleAccordionChange = (panel) => (event, newExpanded) => {
    window.sessionStorage.setItem('selectedPanel', panel);
    setExpanded(newExpanded ? panel : false);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  React.useEffect(() => {
    setDrawerOpen(props.drawerOpen);
  }, [props.drawerOpen])

  const pageRedirect = (path) => {
    window.sessionStorage.setItem('selectedTab', value);
    props.toggleDrawer(!drawerOpen, path);
  }
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          //   variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab wrapped className={classes.tabBtn} label="Hacker Anchor" {...a11yProps(0)} />
          <Tab wrapped className={classes.tabBtn} label="Demand Supply" {...a11yProps(1)} />
          <Tab wrapped className={classes.tabBtn} label="Training Facilitator" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <div value={value} index={0} dir={theme.direction}>
          <div>
            <Accordion square expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
                <Typography>Dashboard</Typography>
              </AccordionSummary>
              <MuiAccordionDetails className={classes.accDetails}>
                <List disablePadding>
                  {hackeranchorDashBoard.map((item, index) => (
                    <ListItem style={props.history.location.pathname === item.path ? selectedStyle : {}} button key={item.path} onClick={() => pageRedirect(item.path)}>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                </List>
              </MuiAccordionDetails>
            </Accordion>
            <Accordion square expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2d-content" id="panel2d-header">
                <Typography>Register Event</Typography>
              </AccordionSummary>
              <MuiAccordionDetails className={classes.accDetails}>
                <List disablePadding>
                  {hackeranchorRegEvent.map((item, index) => (
                    <ListItem style={props.history.location.pathname === item.path ? selectedStyle : {}} button key={item.path} onClick={() => pageRedirect(item.path)}>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                </List>
              </MuiAccordionDetails>
            </Accordion>
            <Accordion square expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3d-content" id="panel3d-header">
                <Typography>Manage Event</Typography>
              </AccordionSummary>
              <MuiAccordionDetails className={classes.accDetails}>
                <List disablePadding>
                  {hackeranchorManageEvent.map((item, index) => (
                    <ListItem style={props.history.location.pathname === item.path ? selectedStyle : {}} button key={item.path} onClick={() => pageRedirect(item.path)}>
                      <ListItemText primary={item.text} />
                    </ListItem>
                  ))}
                </List>
              </MuiAccordionDetails>
            </Accordion>
            <List disablePadding>
              <ListItem style={props.history.location.pathname === '/more' ? selectedStyle : {}} button key={'more'} onClick={() => pageRedirect('/more')}>
                <ListItemText primary="More" />
              </ListItem>
            </List>
          </div>
        </div>
        <div value={value} index={1} dir={theme.direction}>
          <List disablePadding>
            {demandPaths.map((item, index) => (
              <ListItem style={props.history.location.pathname === item.path ? selectedStyle : {}} button key={item.text} onClick={() => pageRedirect(item.path)}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </div>
        <div value={value} index={2} dir={theme.direction}>
          <List disablePadding>
            {trainingPaths.map((item, index) => (
              <ListItem style={props.history.location.pathname === item.path ? selectedStyle : {}} button key={item.text} onClick={() => pageRedirect(item.path)}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Accordion square >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3d-content" id="panel3d-header">
              <Typography>Master</Typography>
            </AccordionSummary>
            <MuiAccordionDetails className={classes.accDetails}>
              <List disablePadding>
                {trainingMorePaths.map((item, index) => (
                  <ListItem style={props.history.location.pathname === item.path ? selectedStyle : {}} button key={item.text} onClick={() => pageRedirect(item.path)}>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
              </List>
            </MuiAccordionDetails>
          </Accordion>
        </div>
      </SwipeableViews>
    </div>
  );
}



export default React.memo(DrawerTabs);