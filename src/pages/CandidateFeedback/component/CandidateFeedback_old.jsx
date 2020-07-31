import React from 'react';
import { Row, Col, InputGroup, FormControl, Button, Toast,  Form, Badge } from 'react-bootstrap';
import Select from 'react-select';
import SelectStyles from '../../../common/SelectStyles';
import '../scss/CandidateFeedback.scss';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
//import RangeSlider from 'react-bootstrap-range-slider';
//import Slider from '@material-ui/core/Slider';
//import "bootstrap/dist/css/bootstrap.css";
//import "bootstrap-slider/dist/css/bootstrap-slider.css"
//import ReactBootstrapSlider from 'react-bootstrap-slider';

class CandidateFeedback extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          eventList: [],
          eventData: [],
          squadList: [],
          candidateList: [],
          sprintList: [],
          selectedEvent: null,
          selectedSquad: null,
          selectedSprint: null,
          selectedCandidate: null,
          CompetancyData:[],
          CompentencyOption:[],
          ShowCompentencyOption : false,
          selectedCompetancy:null,
          finalStatusOption:[{value:"selected",label:"Selected"},{value:"onhold",label:"On Hold"},{value:"rejected",label:"Rejected"}],
          selectedFinalStatus: null,
          OtherAssessmentData:[],
          showFinalStatus : false,
          fbcomment: '',
          showSuccessMessage:false,
          toastMessage: '',
        }
      }

      componentDidMount() {
        this.getEventList();
      }
    
      getEventList = () => {
        this.props.getEventList().then(response => {
          let eventList = [];
          eventList = response.arrRes.map(list => {
            return {
              value: list.EventId,
              label: list.Name
            }
          })
          this.setState({ eventData: response.arrRes, eventList });
        });
      } 

      handleEventChange = (selectedEvent) => {
        this.setState({ selectedEvent });
        const reqObj = { eventID: selectedEvent.value }
 
        this.props.getSquadList(reqObj).then(response => {
           
            if (response && response.arrRes) {
                let squadList = [];
                squadList = response.arrRes.map(list => {
                    return {
                        value: list.ID,
                        label: list.SquadName
                    }
                })
 
                const req = { EventID: selectedEvent.value };
                this.props.getEventDetails(req).then((eventResponse) => {
                
                    if (eventResponse && eventResponse.arrRes) {
                        let sprintList = [];
                        sprintList = eventResponse.arrRes[0].AssessmentScale.map(list => {
                            return {
                                value: list,
                                label: list
                            }
                        })
                      
                       const OtherAssessmentData = eventResponse.arrRes[0].OtherAssessmentData.map(list => {
                          return {...list, value: 1}
                        })
                        this.setState({CompetancyData:eventResponse.arrRes[0].CompetancyData,OtherAssessmentData});
                       
                        const user_id = this.props.userDetails.user_id;
                        const organiserIDs = eventResponse.arrRes[0].OrganisersId;
                        const panelistIDs = eventResponse.arrRes[0].PanelData;
                        const isOrganiser = organiserIDs.find((id) => id.userID === user_id);
                        const ispanelist = panelistIDs.find((id) => id.userID === user_id);
                        
                        if (ispanelist !== undefined || isOrganiser !== undefined) {
                    
                            const foundIndex = eventResponse.arrRes[0].AssessmentScale.findIndex(list => list === 'Final Assessment')
                                                    
                            sprintList.splice(foundIndex,0,{value:'Show and Tell assesment',label:'Show and Tell assesment'});
                            this.setState({ squadList, sprintList, selectedSquad:null, candidateList: [] });
 
                        } else {
                            this.setState({ squadList: [], sprintList: [], selectedSquad: null, selectedEvent:null, candidateList: [],selectedSprint: null,selectedCandidate: null, ShowCompentencyOption:false, CompentencyOption:[],selectedFinalStatus:null, });
                            alert('You do not have permission. Please contact Organiser.');
                        }
 
                    } else {
                        alert('Something went wrong. Please try again later.');
                    }
                   
                });
 
            } else {
                alert('no squad data');
            }
        });
 
    }

    onSquadListChange = (selectedSquad) => {
        this.setState({ selectedSquad });
        this.candidateList(selectedSquad);
     }
    
      candidateList = (squadId) => {
        const reqObj = {
          squad_id: squadId.value
        }
        this.props.squadCandidateList(reqObj).then((response) => {
            let candidateList = [];
            candidateList = response.arrRes.map(list => {
                return {
                    value: list.CandidateID,
                    label: list.EmpName
                }
                })
                this.setState({ candidateList });    
        });
        
      } 

      onSprintListChange = (selectedSprint) => {
        this.setState({ selectedSprint });
        let CompentencyOption = [];
        CompentencyOption = this.state.CompetancyData.map(list => {
        return {
                value: list.compentancyID,
                label: list.CompetancyName
             }
         })    
          
        if(selectedSprint.value === 'Show and Tell assesment' || selectedSprint.value === 'Final Assessment'){
            this.setState({ CompentencyOption, ShowCompentencyOption:true, selectedFinalStatus:null});
        }else{
          this.setState({ CompentencyOption:[], ShowCompentencyOption:false,selectedFinalStatus:null});
        }

        if(selectedSprint.value === 'Final Assessment' ){
          this.setState({showFinalStatus:true});
      }else{
        this.setState({showFinalStatus:false,selectedFinalStatus:null});
      }
      }
       
    onCandidateListChange = (selectedCandidate) => {
        this.setState({ selectedCandidate });
     }
     
     onCompetancyChange = (selectedCompetancy) => {
      this.setState({ selectedCompetancy });
     }
     onFinalStatusChange  = (selectedFinalStatus) => {
      this.setState({ selectedFinalStatus });
     }

     onSilderChange = (e, list) =>{
     
      const {OtherAssessmentData}=this.state;
    
      list.value = e.target.value;
      const findAssessmentIndex = OtherAssessmentData.findIndex(assessment =>
        list.OtherAssessmentId === assessment.OtherAssessmentId);
        const updatedAssessmentData = [...OtherAssessmentData];
        updatedAssessmentData[findAssessmentIndex].value = e.target.value;
        this.setState({OtherAssessmentData: updatedAssessmentData });
    
    } 

    inputFieldChange = (e) => {
      this.setState({fbcomment: e.target.value });
      
    }
  

    feedbackSubmit = () => {

       const othAssRating = this.state.OtherAssessmentData.map(list => {
        return {
          scaleID: list.OtherAssessmentId,
          scaleVAL: list.value
            }
         }) 
        const reqObj = {
        eventID:this.state.selectedEvent.value,
        squadID: this.state.selectedSquad.value,
        candidate_id: this.state.selectedCandidate.value,
        otherAssessment:othAssRating,
        feedback: this.state.fbcomment,
        sprintLevel: this.state.selectedSprint.value,
        finalStatus: this.state.selectedSprint.value === 'Show and Tell assesment' ? this.state.selectedCompetancy.label :  this.state.selectedFinalStatus.value,
        userID:  this.props.userDetails.user_id,
        panelId :  this.props.userDetails.user_id

      } 
     
      this.props.candidateFB(reqObj).then((response) => {
   
        if (response.status === 'Already Feedback submitted') {
          this.setState({
            showSuccessMessage: true,
            toastMessage: 'Feedback for this Candidate already submitted.'
          });
          //  this.props.history.push('/homePage');
        }
        else {
          this.setState({
            showSuccessMessage: true,
            toastMessage: 'Feedback submitted successfully.'
          });
        }
      })

    }
    render() {
    const { selectedEvent, eventList, squadList, selectedSquad, sprintList, candidateList, selectedSprint, selectedCandidate, CompentencyOption,selectedCompetancy, ShowCompentencyOption,finalStatusOption,selectedFinalStatus,OtherAssessmentData,showFinalStatus, fbcomment,showSuccessMessage,toastMessage } = this.state;

        return (
            <div className="candidateFeedBackWrapper">
            <h3 className='pageTitle'>Candidate Feedback</h3>
            <div className='feedbackForm'>
              <Row>
                <Col className='fieldName'><span>Event Name:</span></Col>
                <Col>
                  <Select
                    className="mb-3"
                    placeholder='Event Name'
                    value={selectedEvent}
                    options={eventList}
                    onChange={this.handleEventChange}
                    styles={SelectStyles()}
                    placeholder='Select the Event'
                  />
    
                </Col>
              </Row>

              <Row>
                <Col className='fieldName'><span>Squad Name:</span></Col>
                <Col>
                  <Select
                    className="mb-3"
                    placeholder='Squad Name'
                    value={selectedSquad}
                    options={squadList}
                    onChange={this.onSquadListChange}
                    styles={SelectStyles()}
                    placeholder='Select the Squad'
                  />
    
                </Col>
              </Row>

              <Row>
                <Col className='fieldName'><span>Sprint List:</span></Col>
                <Col>
                  <Select
                    className="mb-3"
                    placeholder='Sprint List'
                    value={selectedSprint}
                    options={sprintList}
                    onChange={this.onSprintListChange}
                    styles={SelectStyles()}
                    placeholder='Select the Sprints'
                  />
    
                </Col>
              </Row>

              <Row>
                <Col className='fieldName'><span>Candidate List:</span></Col>
                <Col>
                  <Select
                    className="mb-3"
                    placeholder='Candidate List'
                    value={selectedCandidate}
                    options={candidateList}
                    styles={SelectStyles()}
                    onChange={this.onCandidateListChange}
                    placeholder='Select the Candidate'
                    
                  />
    
                </Col>
              </Row>
          
             {OtherAssessmentData.map((list) =>
                      <div  key={list.OtherAssessmentId}>
                      <Form.Group controlId="formBasicRange">
                      <Row>
                      <Col> 
                      <Form.Label>{list.OtherAssementScaleName}</Form.Label> {' '}
                      <Badge pill variant="primary">{list.value}</Badge>
                      </Col>
                      <Col> 
                      <RangeSlider
                        value ={list.value}
                        onChange={(e) =>this.onSilderChange(e,list)}
                        min={1}
                        max={5}
                        step={1}
                        tooltip='auto'
                        tooltipPlacement='top'
                      />
                         </Col>
                      </Row>
                      </Form.Group>
                      </div>
                    )}  
              {ShowCompentencyOption && <Row>
              <Col className='fieldName'><span>Compentency Rating</span></Col>
                <Col>
                  <Select
                    name="compentencyRating"
                    className="mb-3"
                    value = {selectedCompetancy}
                    placeholder='Candidate List'
                    options={CompentencyOption}
                    styles={SelectStyles()}
                    placeholder='Select Compentency'
                    onChange={this.onCompetancyChange}
                  />
    
                </Col>
              </Row>}

              <Row>
              <Col className='fieldName'><span>Feedback</span></Col>
                <Col>
                  <InputGroup className="mb-3">
                    <FormControl as="textarea" name="feedback" placeholder="Candidate Feedback" value={fbcomment} onChange={this.inputFieldChange} />
                  </InputGroup>
                </Col>
              </Row>

             {showFinalStatus &&<Row>
              <Col className='fieldName'><span>Final Status </span></Col>
                <Col>
                  <Select
                    name="finalStatus"
                    className="mb-3"
                    value = {selectedFinalStatus}
                    placeholder='Select Final Status'
                    options={finalStatusOption}
                    styles={SelectStyles()}
                    
                    onChange={this.onFinalStatusChange}
                  />
    
                </Col>
              </Row>}
              <Row>
                <Col>
                  <Button className='appButton' onClick={this.feedbackSubmit} >Submit </Button>
                 </Col> 
              </Row>
           
            {showSuccessMessage &&
          <Toast
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              background: '#deeddd',
              border: '1px solid #28a745',
              color: '#6c757d',
              fontWeight: 500,
              width: 400
            }}
            onClose={() => this.setState({ showSuccessMessage: false })}
            show={showSuccessMessage}
            delay={3000}
            autohide
          >
            <Toast.Header style={{ background: '#deeddd', borderBottom: '1px solid #28a745' }}>
              <strong className="mr-auto">Success</strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        }
            </div>  
           
          </div>
    
    
        )
    }
}

export default CandidateFeedback;