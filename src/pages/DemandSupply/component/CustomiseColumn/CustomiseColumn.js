import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
// import SendIcon from '@material-ui/icons/Send';

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

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

export default function CustomizedMenus(props) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [columns, setColumns] = React.useState(props.columns.map((data) => { return { title: data.title,name : data.name } }));
    const { classes, buttonName, status, disabled } = props
   // console.log(columns)

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
                {
                    columns.map((item, i) => {
                        return (
                            <FormControlLabel
                                control={<Checkbox checked={item.checked} onChange={() => {
                                   
                                    columns[i].checked = !item.checked
                                    setColumns(columns)
                                  
                                }}
                                    name={item.name} />}
                                label={item.title}
                            />
                        )
                    })
                }
                <div></div>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.button}
                    onClick={handleListItemClick}
                >
                    Apply
               </Button>
            </StyledMenu>

        </React.Fragment>
    );
}
