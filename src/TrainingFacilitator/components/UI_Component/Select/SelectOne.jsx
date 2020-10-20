import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Select from 'react-select';
import SelectStyles from './SelectStyles';

class SelectOne extends React.Component {

	constructor(props) {
		super(props)
		this.state = { value: null, errorMessage: false, options: props.options, isMulti: props.isMulti }
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.options !== this.state.options) {
			this.setState({ options: nextProps.options, value: nextProps.value })
		}
		if (nextProps.value !== this.state.value) {
			if (nextProps.isMulti) {
				const skillVal = this.state.options.filter(f => nextProps.value.includes(f.value));
				this.setState({ value: skillVal ? skillVal : [] });
			} else {
				this.setState({ value: nextProps.value })
			}
		}
		if (nextProps.isMulti !== this.state.isMulti) {
			this.setState({ isMulti: nextProps.isMulti })
		}
	}
	// static getDerivedStateFromProps(props, state) {
	// 	if (props.options !== state.options) {
	// 		return {
	// 			options: props.options,
	// 			value: props.value
	// 		};
	// 	}
	// 	if (props.value === null) {
	// 		return {
	// 			value: props.value
	// 		};
	// 	}
	// 	if (props.value !== state.value) {
	// 		console.log('--state.value--', state.value);
	// 		return {
	// 			value: props.value
	// 		};
	// 	}
	// 	if (props.isMulti === state.isMulti) {
	// 		return {
	// 			isMulti: props.isMulti
	// 		};
	// 	}
	// 	return null;
	// }


	handleChange = (e) => {
		if (this.state.isMulti) {
			this.setState({ value: e });
			const value = [];
			if (e) {
				e.forEach(item => {
					value.push(item.value)
				})
			}
			this.props.onChange({ target: { value, name: this.props.name } });
			// this.props.onChange({ target: { ...[e], name: this.props.name } });
		} else {
			this.setState({ value: e });
			this.props.onChange({ target: { ...e, name: this.props.name } });
		}


		// this.setState({
		// 	selectedSkillSet
		//   });
		//   const value = [];
		//   if(selectedSkillSet) {
		// 	selectedSkillSet.forEach(item => {
		// 	  value.push(item.value)
		// 	})
		//   }
		//   this.props.onEventChange({target: {value, name: 'skillset'}});
	}

	render() {
		const { options, value } = this.state;
		return (
			<div style={{minHeight: 75}}>
				<Typography variant="caption" display="block" gutterBottom>
					{this.props.fieldLabel}
				</Typography>
				<Select
					placeholder={this.props.placeholder}
					onChange={this.handleChange}
					options={options}
					defaultValue={value}
					value={value}
					styles={SelectStyles()}
					isMulti={this.props.isMulti}
					closeMenuOnSelect={!this.props.isMulti}
					isDisabled={this.props.isDisabled}
				/>
				{this.props.errorMessage !== undefined ? <div className="errorMsg">{this.props.errorMessage}</div> : null}
			</div>
		)
	}
}

SelectOne.propTypes = {
	isDisabled: PropTypes.bool,
	isMulti: PropTypes.bool,
	ariaDescribedBy: PropTypes.string,
	ariaLabel: PropTypes.string,
	placeholder: PropTypes.string,
	name: PropTypes.string,
	id: PropTypes.string,
	className: PropTypes.string,
};


SelectOne.defaultProps = {
	isDisabled: false,
	isMulti: false,
	ariaDescribedBy: '',
	ariaLabel: '',
	placeholder: '',
	name: '',
	id: '',
	className: '',
};

export default SelectOne;