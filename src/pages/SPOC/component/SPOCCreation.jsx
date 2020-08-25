import React from 'react';
import { Button, Container, TextField } from '@material-ui/core';
import '../scss/SPOCCreation.scss';

class SPOCCreation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '', sapid: '', phone_number: '', email: '', showToast: false,
            toastMsg: null, errors: {}
        }
    }

    //Validation
    validateform() {
        let errors = {};
        let formIsValid = true;
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i)
        if (!pattern.test(this.state.email)) {
            formIsValid = false;
            errors["email"] = "Enter Valid Email"
        }
        if (this.state.phone_number.length !== 10) {
            formIsValid = false;
            errors["phone_number"] = "Enter Valid phone no"
        }
        this.setState({ errors: errors });
        return formIsValid;
    }

    addSPOC = () => {
        if (this.validateform()) {
            const details = {
                spoc_sapid: this.state.sapid,
                spoc_name: this.state.name,
                spoc_email: this.state.email,
                spoc_contact_no: this.state.phone_number
            }
            this.props.addSPOC(details).then(response => {
                if (response.errCode === 201) {
                    this.setState({
                        sapid: '',
                        name: '',
                        phone_number: '',
                        email: '',
                        showToast: true,
                        toastMsg: "SPOC Added Successfully"
                    })
                }
                else {
                    this.setState({
                        sapid: '',
                        name: '',
                        phone_number: '',
                        email: '',
                        showToast: true,
                        toastMsg: "Something went wrong"
                    })
                }
            })

        }

    }
    render() {
        const { sapid, name, phone_number, email, toastMsg, showToast } = this.state;
        return (
            <div className="spoc_container">
                <Container id="Container">
                    <h3 className="text-center mb-3 mt-3">ADD SPOC</h3>
                    <form noValidate autoComplete="off">
                        <TextField
                            name="name"
                            required={true}
                            id="name"
                            className="w-100"
                            label="Enter Name"
                            type="text"
                            inputProps={{ pattern: "[a-zA-Z]" }}
                            onChange={(e) => this.setState({ name: e.target.value })} />
                        <TextField
                            name="sapid"
                            required={true}
                            id="sap_id"
                            type="number"
                            className="w-100"
                            label="Enter Sap Id"
                            onChange={(e) => this.setState({ sapid: e.target.value })} />
                        <TextField
                            name="phoneNumber"
                            id="phone-number"
                            className="w-100"
                            required={true}
                            type="number" inputProps={{ max: 12 }}
                            label="Enter Phone Number"
                            onChange={(e) => this.setState({ phone_number: e.target.value })} />
                        {this.state.errors.phone_number !== undefined ? <div className="errorMsg">{this.state.errors.phone_number}</div> : null}
                        <TextField
                            type="email"
                            required={true}
                            name="email"
                            id="email"
                            className="w-100"
                            label="Enter Email Address"
                            onChange={(e) => this.setState({ email: e.target.value })} />
                        {this.state.errors.email !== undefined ? <div className="errorMsg">{this.state.errors.email}</div> : null}
                        <Button variant="contained" className="mt-3 pull-right" color="primary" label="Submit" disabled={name === '' || sapid === '' || email === '' || phone_number === ''} onClick={() => { this.addSPOC() }} >Submit</Button>
                    </form>
                </Container>
            </div>
        )
    }
}

export default SPOCCreation;