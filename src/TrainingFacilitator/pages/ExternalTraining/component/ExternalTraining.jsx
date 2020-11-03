import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Buttons from '../../../components/UI_Component/Buttons/Buttons';
import Textbox from '../../../components/UI_Component/Textbox/Textbox';
import DateTimePicker from '../../../components/UI_Component/DateTimePicker/DateTimePicker';
import '../scss/ExternalTraining.scss'

class ExternalTraining extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            batchName: '', location: '',batchNM:'', sme:'', startDate: new Date(), endDate: new Date(), errors: {}
        }}
    
        //Validation
        validateform() {
            let errors = {};
            let formIsValid = true;
            if (this.state.batchName.length === 0) {
                formIsValid = false;
                errors["batchName"] = "Enter Valid batch name"
            }
            if (this.state.location.length === 0) {
                formIsValid = false;
                errors["location"] = "Enter Valid location"
            }
            if (this.state.batchNM.length !== 10 ) {
                formIsValid = false;
                errors["batchNM"] = "Enter Valid Batch NM"
            }    
            this.setState({ errors: errors });           
            return formIsValid;
        }
    
    
    
        submitForm = () => {
            /* if (this.validateform()) {
                localStorage.setItem("token", 1)
                this.props.history.push('/home')
            } */
            console.log("------------");
        }      
       
       

    render() {
        return (
            <div className="batchMaster_container">           
            <section className="blue_theme">
                <Container>
                <Row>
                <Col xs ={12} md = {12} lg="12" >
                    <h2 className="text-center">External Training</h2>                   
                </Col>
                </Row>
                <Col xs ={12} md = {12} lg="12" >
                <form className="">
                <Row>
                <Col xs ={12} md = {12} lg="6" >
                <Textbox 
                    value = {this.state.batchName}
                    fieldLabel ="Training Name"
                    id="batchName"
                    type="text"
                    placeholder = "Training Name"                    
                    errorMessage = {this.state.errors.batchName === "" ? null : this.state.errors.batchName }
                    name ="batchName"
                    aria-label="Batch Name"
                    aria-describedby="Batch Name"
                    onChange={(val) => {        
                        this.setState({ batchName: val });                      
                   }}
                    />
                   
                    <Textbox 
                    fieldLabel ="External Trainer Name "
                    value = {this.state.batchNM}
                    id="batchNM"
                    type="text"
                    placeholder = "External Trainer Name "                    
                    errorMessage = {this.state.errors.batchNM === "" ? null : this.state.errors.batchNM }
                    name ="batchNM"
                    aria-label="Batch NM"
                    aria-describedby="Batch NM"
                    onChange = {(val) => {        
                        this.setState({ batchNM: val });                      
                   }}
                    />  
                    <Textbox 
                    fieldLabel ="Contact No"
                    value = {this.state.sme}
                    id="sme"
                    type="number"
                    placeholder = "Contact No"                    
                    errorMessage = {this.state.errors.sme === "" ? null : this.state.errors.sme }
                    name ="sme"
                    aria-label="sme"
                    aria-describedby="psmehone_no"
                    maxlength = {10}
                    onChange={(val) => {        
                        this.setState({ sme: val });                      
                   }}
                    /> 
                    <Textbox 
                    fieldLabel ="Email ID"
                    value = {this.state.sme}
                    id="sme"
                    type="email"
                    placeholder = "Email ID"                    
                    errorMessage = {this.state.errors.sme === "" ? null : this.state.errors.sme }
                    name ="sme"
                    aria-label="sme"
                    aria-describedby="psmehone_no"
                    maxlength = {10}
                    onChange={(val) => {        
                        this.setState({ sme: val });                      
                   }}
                    />  
                <Textbox 
                    fieldLabel ="Duration ID"
                    value = {this.state.sme}
                    id="sme"
                    type="text"
                    placeholder = "Duration ID"                    
                    errorMessage = {this.state.errors.sme === "" ? null : this.state.errors.sme }
                    name ="sme"
                    aria-label="sme"
                    aria-describedby="psmehone_no"
                    maxlength = {10}
                    onChange={(val) => {        
                        this.setState({ sme: val });                      
                   }}
                    />                
                 
                </Col>
                <Col xs ={12} md = {12} lg="6" >
                  
                <DateTimePicker 
                  fieldLabel="Start Date"
                  isdisabled ="true"
                  showDate= {this.state.startDate}
                  onChange = {(val) => {        
                    this.setState({ startDate: val });                      
                  }}
                  />
                <DateTimePicker 
                  fieldLabel="End Date	"
                  isdisabled ="false"
                  minDate ={new Date()}
                  maxDays ={8}
                  showDate= {this.state.endDate}
                  onChange = {(val) => {        
                    this.setState({ endDate: val });                      
                  }}
                  />                  
                 
                   
                   <Textbox 
                    fieldLabel ="Account"
                    value = {this.state.sme}
                    id="sme"
                    type="text"
                    placeholder = "Account"                    
                    errorMessage = {this.state.errors.sme === "" ? null : this.state.errors.sme }
                    name ="sme"
                    aria-label="sme"
                    aria-describedby="psmehone_no"
                    maxlength = {10}
                    onChange={(val) => {        
                        this.setState({ sme: val });                      
                   }}
                    />  
                   
                    <Textbox 
                    fieldLabel ="Request BY	"
                    value = {this.state.sme}
                    id="sme"
                    type="text"
                    placeholder = "Request BY"                    
                    errorMessage = {this.state.errors.sme === "" ? null : this.state.errors.sme }
                    name ="sme"
                    aria-label="sme"
                    aria-describedby="psmehone_no"
                    maxlength = {10}
                    onChange={(val) => {        
                        this.setState({ sme: val });                      
                   }}
                    />
                </Col>
                </Row>
                <Row>
                <Col>
                <Col>
                <Buttons
                className = "float-right"                
                value="Submit" 
                onClick={this.submitForm}/>
                </Col>
                </Col>
                </Row>
                </form>
                </Col>  
                          
           
                  
           
            
            </Container>
            </section>
          </div>
        )
    }
}
  

export default ExternalTraining;