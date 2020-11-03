import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-date-picker';
import { Typography } from '@material-ui/core';
import './DateTimePicker.scss'

class DateTimePicker extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			value: props.showDate,
			errorMessage: false
		}
	}

	handleChange = (e) => {
		this.setState({ value: e });
		this.props.onChange({ target: { value: e, name: this.props.name } });
	}

	static getDerivedStateFromProps(props, state) {
		if (props.value !== state.value) {
			return {
				value: props.value
			};
		}
		return null;
	}
	render() {
		return (
			<div>
			<Typography variant="caption" display="block" gutterBottom>
				{this.props.fieldLabel}
			</Typography>
					<DatePicker
						className="datePicker"
						format="yyyy-MM-dd"
						onChange={(e) => this.handleChange(e)}
						value={this.state.value}
						monthPlaceholder="mm"
						minDate={this.props.minDate}
						yearPlaceholder="yyyy"
						dayPlaceholder="dd"
						disabled={this.props.disabled}
					/>
				{this.props.errorMessage !== undefined ? <div className="errorMsg">{this.props.errorMessage}</div> : null}
				</div>
		)
	}
}

DateTimePicker.propTypes = {
	disabled: PropTypes.bool,
	placeholder: PropTypes.string,
	name: PropTypes.string,
	id: PropTypes.string,
	className: PropTypes.string,
	minDate: PropTypes.any
};


DateTimePicker.defaultProps = {
	disabled: false,
	placeholder: '',
	name: '',
	id: '',
	minDate: new Date(),
	className: '',
};

export default DateTimePicker;