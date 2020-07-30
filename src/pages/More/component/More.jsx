import React from 'react';
import { Modal, FormControl, InputGroup, Toast, Button } from 'react-bootstrap';
import moment from 'moment';
import '../scss/More.scss';

class More extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUserModal: false,
            items: [
                { name: 'Add Client', id: 1, iconName: 'fa fa-users', inputValue: 'Client Name' },
                { name: 'Add Location', id: 2, iconName: 'fa fa-location-arrow', inputValue: 'Location Name' },
                { name: 'Add Skill', id: 3, iconName: 'fa fa-plus', inputValue: 'Skill Name' },
                { name: 'Add Competancy', id: 4, iconName: 'fa fa-file-text-o', inputValue: 'Competancy Name' },
                { name: 'Add Assessment', id: 5, iconName: 'fa fa-file-o', inputValue: 'Assessment Name' },
            ],
            selectedItem: {},
            inputValue: '',
            inputAsstValue: '',
            toastMsg: null,
            showToast: false
        }
    }

    viewUserList = (item) => {
        this.setState({
            showUserModal: true,
            selectedItem: item
        });
    }
    handleInputValue = (e) => {
        const value = e.target.value;
        this.setState({
            inputValue: value
        });
    }
    handleInputAsstValue = (e) => {
        const value = e.target.value;
        this.setState({
            inputAsstValue: value
        });
    }

    handleOnSubmit = (id) => {
        let reqObj;
        let reqAPI;
        let sccuessMsg;
        if (id === 1) {
            reqObj = { "ClientName": this.state.inputValue, "ClientStatus": 1 };
            reqAPI = this.props.addClientDetails(reqObj);
            sccuessMsg = 'Client Added Successfully';
        } else if (id === 2) {
            let latitude;
            let longitude;
            let dateTime = new Date();
            let date = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
            navigator.geolocation.getCurrentPosition(function (position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
            });
            reqObj = {
                "LocName": this.state.inputValue, "LocLatitude": latitude,
                "LocLongitude": longitude, "CreatedDate": date, "CreatedBy": this.props.userDetails.user_id
            };
            reqAPI = this.props.addLocationDetails(reqObj);
            sccuessMsg = 'Location Added Successfully';
        } else if (id === 3) {
            reqObj = { "skillName": this.state.inputValue };
            reqAPI = this.props.addSkillDetails(reqObj);
            sccuessMsg = 'Skill Added Successfully';
        } else if (id === 4) {
            reqObj = { "CompetancyName": this.state.inputValue, "CreatedBy": this.props.userDetails.user_id };
            reqAPI = this.props.addCompetancyDetails(reqObj);
            sccuessMsg = 'Competancy Added Successfully';
        } else if (id === 5) {
            reqObj = { "AssessName": this.state.inputValue, "AssessValue": this.state.inputAsstValue, "createdBy": this.props.userDetails.user_id }
            reqAPI = this.props.addAssessmentDetails(reqObj);
            sccuessMsg = 'Assessment Added Successfully';
        }
        reqAPI.then((res) => {
            if (res.errCode === 200) {
                this.setState({
                    toastMsg: sccuessMsg,
                    showToast: true,
                    showUserModal: false
                });
            }

        })
    }
    handleClose = () => this.setState({ showUserModal: false });

    render() {
        const { showUserModal, items, selectedItem, showToast, toastMsg } = this.state;
        return (
            <section className="container-fluid more-wrapper">
                <div className="row">
                    {items.map(item => {
                        return <div className="col-sm col-md-3">
                            <div className="card" onClick={() => this.viewUserList(item)} key={item.id}>
                                <div className="card-body text-center">
                                    <i className={item.iconName} aria-hidden="true"></i>
                                    <div className="card-title">{item.name}</div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
                <Modal className='eventModal' show={showUserModal} centered onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedItem.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder={selectedItem.inputValue}
                                aria-label={selectedItem.name}
                                aria-describedby="basic-addon1"
                                onChange={this.handleInputValue}
                            />
                        </InputGroup>

                        <InputGroup className={selectedItem.id !== 5 ? "hidden mb-3" : "mb-3"}>
                            <FormControl
                                placeholder='Value'
                                type='number'
                                aria-label='Value'
                                aria-describedby="basic-addon1"
                                onChange={this.handleInputAsstValue}
                            />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer className="text-center d-flex justify-content-center">
                        <Button className='file-upload fileUploadBtn btn shadow' onClick={() => this.handleOnSubmit(selectedItem.id)}>Submit</Button>
                    </Modal.Footer>
                </Modal>

                {showToast &&
                    <Toast
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: '#deeddd',
                            border: '1px solid #28a745',
                            color: '#6c757d',
                            fontWeight: 500,
                            width: 400
                        }}
                        onClose={() => this.setState({ showToast: false })}
                        show={showToast}
                        delay={3000}
                        autohide
                    >
                        <Toast.Body>{toastMsg}</Toast.Body>
                    </Toast>
                }
            </section>

        )
    }
}

export default More;