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

const CustomiseView = (props) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const { classes, buttonName, status, setViewType } = props

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleListItemClick = (e, item) => {
        setViewType(item)
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
                            <StyledMenuItem onClick={(event) => handleListItemClick(event, item)} key={i}>
                                <ListItemText primary={item.title}  />
                            </StyledMenuItem>
                        )
                    })
                }
            </StyledMenu>
            
        </React.Fragment>
    );
}

export default React.memo(CustomiseView);