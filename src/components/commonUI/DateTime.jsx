import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../common/SelectStyles';

class DateTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateValue: props.selectedValue
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedValue !== this.state.dateValue) {
            this.setState({ dateValue: nextProps.selectedValue });
        }
    }

    getDate = (e) => {
        this.setState({ dateValue: e.target.value });
        this.props.onEventChange(e);
    }

    render() {
        return (
            <Fragment>
                <Row>
                    <Col className='fieldName'><span>Date:</span></Col>
                    <Col>
                        <Select
                            value={this.state.dateValue}
                            onChange={this.handleEventChange}
                            options={this.state.dateValue}
                            defaultValue={this.state.dateValue}
                            styles={SelectStyles(220)}
                            className="mb-3"
                            placeholder='Date'
                        />
                    </Col>
                </Row>
                {/* <IonLabel>Date</IonLabel>
                <IonDatetime name='date' disabled={this.props.disabledField} value={this.state.dateValue} onIonChange={this.getDate} placeholder="Select Date"></IonDatetime> */}
            </Fragment>
        );
    }
}

export default DateTime;
