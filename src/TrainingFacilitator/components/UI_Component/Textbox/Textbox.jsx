import React from 'react';
import { TextField, withStyles, Typography } from '@material-ui/core';
const styles = (theme) => ({

    textField: {
        width: '100%'
    },
});
class Textbox extends React.Component {

    constructor(props) {
        super(props)
        this.state = { value: '', errorMessage: false }
        this.state = {
            value: this.props.value
        }
    }


    handleChange = (e) => {
        this.setState({ value: e.target.value });
        this.props.onChange(e);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.state.value) {
            this.setState({ value: nextProps.value });
        }
    }
    render() {
        return (
            <div>
                <Typography variant="caption" display="block" gutterBottom>
                    {this.props.fieldLabel}
                </Typography>
                <TextField
                    id={this.props.id}
                    className={this.props.classes.textField}
                    variant="outlined"
                    margin="dense"
                    onChange={(e) => this.handleChange(e)}
                    name={this.props.name}
                    value={this.state.value}
                    placeholder={this.props.placeholder}
                    type={this.props.type}
                    disabled={this.props.isDisabled}
                    maxLength={this.props.maxlength}
                />
                {this.props.errorMessage !== undefined ? <div className="errorMsg">{this.props.errorMessage}</div> : null}
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Textbox);
