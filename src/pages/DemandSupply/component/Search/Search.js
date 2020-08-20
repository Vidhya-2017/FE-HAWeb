import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '60%',
    margin:'15px auto'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },

}));

export default function CustomizedInputBase(props) {
  const classes = useStyles();
  const {getCandidateData} = props;

  const [searchText,setSearchText] = useState('')

  const onChangeSearchInput = e =>{
      setSearchText(e.target.value)
      console.log('hi',searchText)
  }

  const onsubmitSearchInput = () => {
    console.log(searchText)
  }

  return (
    
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search Candidate"
        onChange = {onChangeSearchInput}
       // inputProps={{ 'aria-label': 'Search Candidate' }}
      />
      <IconButton className={classes.iconButton} aria-label="search" 
      onClick={() => getCandidateData(searchText)}>
        <SearchIcon />
      </IconButton>
      
    </Paper>
  );
}
