import React from 'react';
import '../scss/SquadFormation.scss';
import { Button, FormCheck, Form, InputGroup, FormControl, Badge, ListGroup, ListGroupItem } from 'react-bootstrap';
import { CandidatePhoto } from '../../../components/commonUI/CandidatePhoto';
import Avatar from '../../../common/images/account.svg';
import { SquadFormActions } from '../modules/SquadFormationActions';
import moment from 'moment';

const inputField = {
    value: '',
    validation: {
        required: true
    },
    valid: false
};

const squadForm = {
    eventName: inputField,
    squadName: inputField,
}

class SquadFormation extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            formIsValid: false,
            loading: false,
            showToast: false,
            toastMsg: '',
            toastColor: 'primary',
            squadId: '',
            selectedCandidate: [],
            squadList: [],
            eventDetailsList: [],
            candidateList: [],
            squadRegister: { ...squadForm },
            candidateView: false,
            search: '',
            imgErr: '',
            checked: false,
            selected: '',
            selectedSquad: '',
            squadTeamImg: '',
        }
        this.imageRef = React.createRef();
    }
    componentDidMount() {
        this.setState({ loading: true })
        SquadFormActions.getEventList().then((response) => {
            if (response && response.arrRes) {
                this.setState({ eventDetailsList: response.arrRes, loading: false });
            } else {
                this.setState({ loading: false, showToast: true, toastMsg: 'Something went Wrong. Please try again later.' })
            }
        })
    }


    getSquadList = (data) => {
        this.setState({ loading: true })
        SquadFormActions.getSquadList(data).then((response) => {
            this.setState({ squadList: response.arrRes, loading: false, checked: false, selectedSquad: '' });
        })
    }

    checkValidity(inputValue, rules, inputType) {
        let value = '';
        if (inputValue) value = inputValue.toString();
        let isValid = true;
        if (!rules) {
            return true;
        }
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }
        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }

    getDataUrl(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            return canvas.toDataURL('image/jpeg');
        }
    }


    inputFieldChange = (e) => {
        const targetName = e.target.name;
        const targetValue = e.detail.value;
        const targetType = e.target.type;
        const updatedSquadForm = {
            ...this.state.squadRegister
        };
        if (targetName === "eventName") {
            updatedSquadForm.squadName.value = '';
            updatedSquadForm.squadName.valid = false;
            const data = { eventID: targetValue };
            this.getSquadList(data);
        }
        const updatedFormElement = {
            ...updatedSquadForm[targetName]
        };
        updatedFormElement.value = targetValue;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation, targetType);
        updatedSquadForm[targetName] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedSquadForm) {
            formIsValid = updatedSquadForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ squadRegister: updatedSquadForm, formIsValid });
    }

    eventFieldChange = (e) => {
        if (e.target.value && e.target.value !== this.state.squadRegister.eventName.value) {
            this.getEventByUser(e);
            // console.log(e.target.value);
            // this.getSquadList(e.target.value);
            // this.inputFieldChange(e);
        }
    }

    getEventByUser = (e) => {
        const req = { EventID: e.target.value };
        // this.setState({ loading: true });
        const user_id = this.props.userDetails.user_id;
        SquadFormActions.getEventByUser(req).then((response) => {
            if (response && response.arrRes) {
                const organiserIDs = response.arrRes[0].OrganisersId;
                const panelistIDs = response.arrRes[0].PanelData;
                const isOrganiser = organiserIDs.find((id) => id.userID === user_id);
                const ispanelist = panelistIDs.find((id) => id.userID === user_id);
                if (ispanelist !== undefined || isOrganiser !== undefined) {
                    this.inputFieldChange(e);
                } else {
                    this.setState({ loading: false, showToast: true, toastMsg: "You don't have permission. Please contact Organiser." });
                }
            }
        })
    }

    handleCheckClick = (e) => {
        if (e.target.checked) {
            //append to array
            this.setState({
                selectedCandidate: this.state.selectedCandidate.concat([e.target.value])
            })
        }
        else {
            //remove from array
            this.setState({
                selectedCandidate: this.state.selectedCandidate.filter(function (val) { return val.ID !== e.target.value.ID })
            })
        }
    }

    handleSquadCheckClick = (e) => {
        var value = JSON.parse(e);
        var image = value.squad_team_img;
        const base64 = value.squad_team_img !== "" ? 'data:image/jpeg;base64,' + image : "";
        if (value.ID !== this.state.squadId) {
            const updatedSquadForm = { ...this.state.squadRegister };
            const updatedFormElement = { ...updatedSquadForm['squadName'] };
            updatedFormElement.value = value.SquadName;
            updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation, '');
            updatedSquadForm['squadName'] = updatedFormElement;
            this.setState({
                squadId: value.ID, squadRegister: updatedSquadForm, checked: true, selectedSquad: value.SquadName, squadTeamImg: base64
            })
        }
        else {
            const updatedSquadForm = { ...this.state.squadRegister };
            const updatedFormElement = { ...updatedSquadForm['squadName'] };
            updatedFormElement.value = '';
            updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation, '');
            updatedSquadForm['squadName'] = updatedFormElement;
            this.setState({ checked: false, selectedSquad: '', squadRegister: updatedSquadForm, squadId: '' })
        }
    }

    getCandidatesEvent = (req, squadId, resetSquadData, toastMsg, showToast, selectedCandidate) => {
        this.setState({ loading: true });
        const squadName = this.state.squadRegister.squadName.value;
        SquadFormActions.getCandidateList(req).then((res) => {
            var candidates = res.arrRes.filter(function (val) { return val.SquadName === squadName || val.SquadName == null })
            this.setState({
                candidateList: candidates,
                squadRegister: { ...resetSquadData },
                selectedCandidate: selectedCandidate,
                loading: false,
                squadId: squadId,
                showToast: showToast,
                toastMsg: toastMsg,
                toastColor: "primary",
                formIsValid: false,
                candidateView: true,
            });
        })
    }

    searchCandidates = (e) => {
        var value = e.target.value, id = this.state.squadRegister.eventName.value
        if (value.length >= 3 || value.length === 0) {
            const req = { 'emp_name': value, 'event_id': id }
            if (this.state.loading === false) {
                this.setState({ loading: true })
                SquadFormActions.getCandidateList(req).then((res: any) => {
                    this.setState({
                        loading: false, candidateList: res.arrRes, search: value
                    })
                })
            }
        }
    }

    submitSquad = () => {
        const formData = this.state.squadRegister
        const candidateList = this.state.selectedCandidate.map((list: any) => {
            return list.ID;
        });
        // var date = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
        const user_id = this.props.userDetails.user_id;
        const reqObj = {
            SquadID: this.state.squadId,
            CandidateID: candidateList,
            EventID: formData.eventName.value,
            isActive: true,
            CreatedBy: user_id,
            UpdatedBy: user_id,
        }
        if (this.state.selectedCandidate.length !== 0) {
            this.setState({ loading: true });

            SquadFormActions.squadCandidatesInsert(reqObj).then((res: any) => {
                if (res && res.errCode === 200) {
                    const { squadRegister } = this.state;
                    const resetSquadData = {
                        ...squadRegister
                    };
                    for (let inputIdentifier in resetSquadData) {
                        formData[inputIdentifier] = resetSquadData[inputIdentifier].value;
                        resetSquadData[inputIdentifier].value = '';
                        resetSquadData[inputIdentifier].valid = false;
                    }
                    this.setState({
                        toastMsg: "Squad Registered successfully",
                        showToast: true,
                        loading: false,
                        toastColor: "primary",
                        candidateView: false,
                        squadList: [],
                        checked: false,
                        selectedSquad: '',
                        squadId: '',
                        squadRegister: { ...resetSquadData },
                    });
                    // this.props.history.push('/homePage');
                }
                else {
                    this.setState({
                        loading: false,
                        toastColor: "primary",
                        showToast: true,
                        toastMsg: res.status,
                    });
                }
            })
        }
        else {
            this.setState({ toastMsg: "Please Select Candidate For Squad", toastColor: "primary", showToast: true })
        }
    }

    nextClick = () => {
        const formData = {};
        const { squadRegister } = this.state;
        this.setState({ loading: true });
        const resetSquadData = {
            ...squadRegister
        };
        for (let inputIdentifier in resetSquadData) {
            formData[inputIdentifier] = resetSquadData[inputIdentifier].value;
        }
        var dateTime = new Date(), imageSrc, imageBase64
        var date = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");
        const user_id = this.props.userDetails.user_id;
        var reqObj = {
            SquadID: this.state.squadId,
            SquadName: formData.squadName,
            EventID: formData.eventName,
            CreatedDate: date,
            CreatedBy: user_id,
            UpdatedBy: user_id,
            UpdatedDate: date,
        }
        if (this.imageRef.current && this.imageRef.current.children && this.imageRef.current.children[0].children[0].tagName === 'IMG') {
            imageSrc = this.imageRef.current.children[0].children[0];
            imageBase64 = this.getDataUrl(imageSrc);
            var pair = { teamImg: imageBase64 && imageBase64.replace('data:image/jpeg;base64,', '') }
            reqObj = { ...reqObj, ...pair }
        }
        // list of candidate
        const req = { event_id: formData.eventName };
        let toastMsg = '';
        let selectedCandidate = this.state.selectedCandidate;
        let showTost = false;
        if (this.state.checked) {
            const squad = this.state.squadList.find((list: any) => list.SquadName === formData.squadName);
            const request = { squad_id: squad.ID };
            SquadFormActions.editSquadImage(reqObj).then((response: any) => {
                if (response && response.errCode === 200) {
                    document.dispatchEvent(new CustomEvent("removePhoto", {
                        detail: { removePhoto: true }
                    }))
                    SquadFormActions.getSquadCandidateList(request).then((squadResponse) => {
                        this.getCandidatesEvent(req, this.state.squadId, resetSquadData, toastMsg, showTost, squadResponse.arrRes)
                    })
                }
            })
        } else {
            SquadFormActions.addSquad(reqObj).then((response) => {
                if (response && response.errCode === 200) {
                    toastMsg = 'Squad Created successfully';
                    showTost = true;
                    this.getCandidatesEvent(req, response.squadId, resetSquadData, toastMsg, showTost, selectedCandidate)
                }
                else {
                    this.setState({
                        loading: false,
                        showToast: true,
                        toastColor: "danger",
                        toastMsg: response.status,
                    });
                }
            });
        }
    }
    render() {
        const { formIsValid, loading, toastMsg, toastColor, showToast,
            squadRegister, eventDetailsList, squadList,
            candidateView, candidateList, selectedCandidate,
            imgErr, checked, search, squadTeamImg } = this.state;

        return (
            <React.Fragment>

                <div>
                    {/* <CandidatePhoto fetchedImage={"asd"} /> */}
                </div>

                {!candidateView ?
                    <div>
                        {imgErr.length > 0 && <div className='imageErr'>{imgErr}</div>}
                        <div >

                            <div className='form-group row'>
                                <label className='col-sm-2 col-form-label'>Event:</label>

                                <Form.Control as="select" name='eventName' value={squadRegister.eventName.value}
                                    onChange={this.eventFieldChange}>
                                    {eventDetailsList.map((list) =>
                                        <option key={list.EventId} value={list.EventId}>{list.Name}</option>
                                    )}

                                </Form.Control>

                            </div>

                            <div className='form-group row'>
                                <label className='col-sm-2 col-form-label'>Squad Name:</label>
                                <input className="form-control py-4" id="squadName"
                                    name="squadName" onChange={this.inputFieldChange}
                                    value={squadRegister.squadName.value}
                                    type="text" placeholder="Enter Squad Name" disabled={checked} />

                            </div>

                            <div className="">
                                {squadList.map((list) =>
                                    <Form.Check
                                        type="radio"
                                        label={list.SquadName}
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios1"
                                        value={list.SquadName}
                                        onClick={() => this.handleSquadCheckClick(JSON.stringify(list))}
                                    />
                                )}
                            </div>

                            <Button className=' btn btn-primary shadow'
                                onClick={this.nextClick} disabled={!formIsValid}>Next</Button>

                        </div>
                    </div>
                    :
                    <div>

                        <div className="SearchBar">
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder="Search Candidates"
                                    aria-label="Search Candidates"
                                    aria-describedby="basic-addon2"
                                    onChange={this.searchCandidates}
                                    value={search}
                                />
                                <InputGroup.Append>
                                    <Button variant="outline-secondary">Button</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>

                        <div >
                            <label className='col-sm-2 col-form-label'>Squad Name : <b>{}</b></label>
                            <Badge variant="primary">{selectedCandidate.length} </Badge>{' '}
                        </div>
                        <div>
                            <label className='col-sm-2 col-form-label'> Selected Count:</label>
                            <Badge variant="primary">{} </Badge>
                        </div>
                        <div className="candidatesList">
                            {candidateList.map((list) =>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <img src={Avatar} alt="AvatarImage" />
                                        <h3>{list.ID}</h3>
                                        <h3>{list.EmpName}</h3>
                                        <p>{list.SkillName}</p>
                                    </ListGroup.Item>

                                    {selectedCandidate.some((data) => data.ID === list.ID) ?
                                        <Form.Check name="selectedCandidateList" checked={true} value={list} onClick={this.handleCheckClick} />
                                        : <Form.Check name="selectedCandidateList" checked={false} value={list} onClick={this.handleCheckClick} />
                                    }
                                </ListGroup>

                            )}
                        </div>


                        <div className='squadFormCntrlPanel'>
                        <Button className=' btn btn-primary shadow'
                                onClick={this.submitSquad} disabled={false}>Submit</Button>
                       
                        </div>
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default SquadFormation;