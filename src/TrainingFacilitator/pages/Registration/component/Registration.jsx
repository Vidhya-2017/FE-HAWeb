import React from 'react';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Buttons from '../../../components/UI_Component/Buttons/Buttons';
import Textbox from '../../../components/UI_Component/Textbox/Textbox';
import Gender from '../../../components/UI_Component/Select/Gender';
import DateTimePicker from '../../../components/UI_Component/DateTimePicker/DateTimePicker';
import '../scss/Registration.scss'
const genderList = [
    {"id":"1","gender":"Male"},
    {"id":"2","gender":"Female"},
   ]
class Registration extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            fName: '', lName: '',phone_no:'', email_id:'',  errors: {}
        }}
    
        //Validation
        validateform() {
            let errors = {};
            let formIsValid = true;
            if (this.state.fName.length === 0) {
                formIsValid = false;
                errors["fName"] = "Enter Valid first Name"
            }
            if (this.state.lName.length === 0) {
                formIsValid = false;
                errors["name"] = "Enter Valid last name"
            }
            if (this.state.phone_no.length !== 10 ) {
                formIsValid = false;
                errors["phone_no"] = "Enter Valid phone no"
            }
            if (this.state.email_id.length === 0 ) {
                formIsValid = false;
                errors["email_id"] = "Enter Valid email ID"
            }
            
    
            this.setState({ errors: errors });
           
            return formIsValid;
        }
    
    
    
        submitForm = () => {
            if (this.validateform()) {
                localStorage.setItem("token", 1)
                this.props.history.push('/home')
            }
        }      
       
    

    render() {
        return (
            <div className="register_container">           
            <section className="blue_theme">
                <Container>
                <Row>
                    <Col xs ={12} md = {12} lg="12" >
                    <h2 className="text-center">Sign Up Now</h2>
                    <form className="login-form">
                    <Textbox 
                    value = {this.state.fName}
                    fieldLabel ="SAP ID"
                    id="fName"
                    type="text"
                    placeholder = "SAP ID"                    
                    errorMessage = {this.state.errors.fName === "" ? null : this.state.errors.fName }
                    name ="fName"
                    aria-label="SAP ID"
                    aria-describedby="SAP ID"
                    onChange={(val) => {        
                        this.setState({ fName: val });
                      
                   }}
                    />
                    <Textbox 
                    value = {this.state.fName}
                    fieldLabel ="First Name"
                    id="fName"
                    type="text"
                    placeholder = "First Name"                    
                    errorMessage = {this.state.errors.fName === "" ? null : this.state.errors.fName }
                    name ="fName"
                    aria-label="First Name"
                    aria-describedby="First Name"
                    onChange={(val) => {        
                        this.setState({ fName: val });
                      
                   }}
                    />
                    <Textbox 
                    fieldLabel ="Last Name"
                    value = {this.state.lName}
                    id="lName"
                    type="text"
                    placeholder = "Last Name"                    
                    errorMessage = {this.state.errors.lName === "" ? null : this.state.errors.lName }
                    name ="name"
                    aria-label="Last Name"
                    aria-describedby="Last Name"
                    onChange={(val) => {        
                        this.setState({ lName: val });
                      
                   }}
                    />  
                     <Gender 
                     fieldLabel ="Gender"
                    id="gender"             
                    name="gender"                
                    placeholder="Gender"
                    aria-label="Gender"
                    aria-describedby="Gender"               
                    size = "1"
                    list = {genderList}
                    onChange={(val) => {        
                        this.setState({ gender: val });
                      
                   }}
                   errorMessage = {this.state.errors.location === "" ? null : this.state.errors.location }
                   />
                    <DateTimePicker 
                    fieldLabel="DOB"
                    maxDays = {0}
                    minDays = {9000}
                    showDate= {new Date()}
                    onChange = {(val) => {        
                        this.setState({ dob: val });                      
                    }}
                  />
                    <Textbox 
                    fieldLabel ="Email ID"
                    value = {this.state.email_id}
                    id="email_id"
                    type="email"
                    placeholder = "Email ID"                    
                    errorMessage = {this.state.errors.email_id === "" ? null : this.state.errors.email_id }
                    name ="email_id"
                    aria-label="Email ID"
                    aria-describedby="Email ID"
                    maxlength = {10}
                    onChange={(val) => {        
                        this.setState({ email_id: val });                      
                   }}
                    /> 
                    <Textbox 
                    fieldLabel ="Phone No"
                    value = {this.state.phone_no}
                    id="phone_no"
                    type="number"
                    placeholder = "Phone No"                    
                    errorMessage = {this.state.errors.phone_no === "" ? null : this.state.errors.phone_no }
                    name ="phone_no"
                    aria-label="phone_no"
                    aria-describedby="phone_no"
                    maxlength = {10}
                    onChange={(val) => {        
                        this.setState({ phone_no: val });                      
                   }}
                    />  
                    
                     <Textbox 
                    fieldLabel ="Password"
                    value = {this.state.phone_no}
                    id="password"
                    type="password"
                    placeholder = "Password"                    
                    errorMessage = {this.state.errors.password === "" ? null : this.state.errors.password }
                    name ="password"
                    aria-label="password"
                    aria-describedby="password"
                    maxlength = {10}
                    onChange={(val) => {        
                        this.setState({ password: val });                      
                   }}
                    /> 
                     <Textbox 
                    fieldLabel ="Confirm Password"
                    value = {this.state.phone_no}
                    id="c_password"
                    type="password"
                    placeholder = "Confirm Password"                    
                    errorMessage = {this.state.errors.c_password === "" ? null : this.state.errors.c_password }
                    name ="c_password"
                    aria-label="Confirm password"
                    aria-describedby=" Confirm password"
                    maxlength = {10}
                    onChange={(val) => {        
                        this.setState({ c_password: val });                      
                   }}
                    />                   
                            
                <Col>
               
                <Buttons
                className = "float-right"                
                value="Submit" 
                onClick={this.submitForm}/>
               
             </Col>            
            </form>
            <Col className="copy-text">Already Registered ? <Link to="/login">Click Here</Link></Col>
            </Col>

           
            </Row>
            </Container>
            </section>
          </div>
        )
    }
}
  

export default Registration;