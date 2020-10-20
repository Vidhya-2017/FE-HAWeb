import React from 'react';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Buttons from '../../../components/UI_Component/Buttons/Buttons';
import Textbox from '../../../components/UI_Component/Textbox/Textbox';
import '../scss/Login.scss'

class Login extends React.Component{

    constructor(props) {
        super(props)
        this.state = {
            password: '', username: '', errors: {}
        }}
    
        //Validation
        validateform() {
            let errors = {};
            let formIsValid = true;
            if (this.state.username.length === 0) {
                formIsValid = false;
                errors["username"] = "Enter Valid User Name"
            }
            if (this.state.password.length === 0) {
                formIsValid = false;
                errors["password"] = "Enter Valid password"
            }
    
            this.setState({ errors: errors });
            return formIsValid;
        }
    
    
    
        login = () => {
            if (this.validateform()) {
                localStorage.setItem("token", 1)
                localStorage.setItem("user", this.state.username)
                this.props.history.push('/trainingCreation')
            }
        }      
       
    

    render() {
        return (
            <div className="login_container">           
            <section className="blue_theme">
                <Container>
                <Row>
                    <Col xs ={12} md = {6} lg="4" >
                    <h2 className="text-center">Login Now</h2>
                    <form className="login-form">
                    <Textbox 
                    value = {this.state.username}
                    fieldLabel ="username"
                    id="username"
                    type="text"
                    placeholder = "Username"                    
                    errorMessage = {this.state.errors.username === "" ? null : this.state.errors.username }
                    name ="username"
                    aria-label="USERNAME"
                    aria-describedby="USERNAME"
                    onChange={(e) => {        
                        this.setState({ username: e.target.value });
                   }}
                    />
                    <Textbox 
                    fieldLabel ="Password"
                    value = {this.state.password}
                    id="password"
                    type="password"
                    placeholder = "Password"                    
                    errorMessage = {this.state.errors.password === "" ? null : this.state.errors.password }
                    name ="password"
                    aria-label="Password"
                    aria-describedby="Password"
                    onChange={(e) => {        
                        this.setState({ password: e.target.value });
                      
                   }}
                    />                   
                            
                <Col>
                <label className="form-check-label">                
                <Link to="/forgetPassword"><small>Forget Password ?</small></Link>
                </label>
                <Buttons
                className = "float-right"                
                value="Login" 
                onClick={this.login}/>
               
             </Col>            
            </form>

            <Col className="copy-text">Not Registered ? <Link to="/register">Click Here</Link></Col>
            </Col>

            <Col xs ={12} md = {6} lg="8" className=" banner-sec">
               <Row>
                <img className="" src="https://static.pexels.com/photos/33972/pexels-photo.jpg" alt="" />
                <Col className="d-md-block">
                    <Col className="banner-text">
                        <h3>Welcome</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                    </Col>	
                </Col>              
                </Row>
            </Col>
            </Row>
            </Container>
            </section>
          </div>
        )
    }
}
  

export default Login;