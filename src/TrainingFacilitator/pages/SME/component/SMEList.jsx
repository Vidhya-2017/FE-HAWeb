import React from 'react';
import MaterialTable from "material-table";
import {
    Paper, withStyles, Typography, Dialog, DialogTitle, TextField, DialogActions, DialogContent,
    Button
} from '@material-ui/core';
import Select from 'react-select';
import SelectStyles from '../../../components/UI_Component/Select/SelectStyles';
import SelectOne from '../../../components/UI_Component/Select/SelectOne';
import SnackBar from '../../../components/UI_Component/SnackBar/SnackBar';
import '../scss/SMEList.scss';

const styles = (theme) => ({
    iconRoot: {
        color: '#6b6b6b'
    },
    paperRoot: {
        width: '70%',
        margin: '20px auto',
        padding: '10px 20px'
    },
});

const inputField = {
    value: '',
    validation: {
        required: true
    },
    valid: false
};

const smeRegForm = {
    smeName: { ...inputField },
    emailId: { ...inputField },
    skills: { ...inputField },
    contactNumber: { ...inputField },
    sapId: { ...inputField },
    role: { ...inputField}
}

class SMEList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formValues: { ...smeRegForm },
            smeListVal: [],
            snackBarOpen: false,
            defaultValue: [],
            snackmsg: '',
            skillList: [],
            role: [],
            snackvariant: '',
            showAddSMEModal: false,
            formIsValid: false,
            showSMEList: false,
            selectedRole: '',
            password: '',
            c_password: '',
            password_msg: null,
            ispassword_disable:true,
        }
        this.columnFields = [
            {
                title: "Name",
                field: "name",
                validate: rowData => rowData.name !== ''
            },
            {
                title: "Sap Id",
                field: "sap_id",
                type: "numeric",
                validate: rowData => this.editValidate(rowData, "sap_id")
            },
            {
                title: "Contact Number",
                field: "phone_number",
                type: "numeric",
                validate: rowData => this.editValidate(rowData, "phone")
            },
          
            {
                title: "Email id",
                field: "email",
                validate: rowData => this.editValidate(rowData, "email")
            },

            {
                title: "Skills",
                field: "SkillName",
                editComponent: props => {                  
                    let defaultValue = this.state.skillList.filter(skill => props.rowData.skill_ids.includes(skill.id))
                     let rolevalue;
                     let skillvalue;
                    if(typeof props.rowData.role_name == 'string'){
                         rolevalue = props.rowData.role_name;
                    }else if(typeof props.rowData.role_name == 'object'){
                         rolevalue = props.rowData.role_name.label;
                    }else{
                          rolevalue = props.rowData.role_name;
                    }
                    let isdiable = false;
                    if(rolevalue === 'SME'){
                       isdiable = false;
                    }else{
                        isdiable = true;
                        skillvalue = '';
                        defaultValue = '';
                    }
                
                    return (
                        <Select
                            placeholder="Skills"
                            onChange={e => props.onChange(e)}
                            id="skills"
                            name="skills"
                            options={this.state.skillList}
                            styles={SelectStyles()}
                            labelId="demo-simple-select-disabled-label"
                            isDisabled={isdiable}
                            isMulti={true}
                            defaultValue={defaultValue}
                            value={skillvalue}
                        />
                    )
                },
                validate: rowData => this.editValidate(rowData, "skill")
            },            
            {
                title: "Role",
                field: "role_name",
                editComponent : props => {
                 const roledefaultvalue = this.state.role.filter(rl => props.rowData.role.includes(rl.id));
                 return <Select
                            placeholder="Role"
                            onChange={e => props.onChange(e)}
                            options={this.state.role}
                            styles={SelectStyles()}
                            defaultValue= {roledefaultvalue}
                    />
                },

                validate: rowData => this.editValidate(rowData, "role")
            },
        ]
    }



    editValidate(data, action) {
        let rolename;
        if(typeof data.role_name == 'string'){
            rolename = data.role_name;
        }else if(typeof data.role_name == 'object'){
              rolename = data.role_name.label;
        }else {
            rolename = data.role_name;
        }

        switch (action) {
            case "phone":
                const phonePattern = RegExp(/^([+]\d{2})?\d{10}$/);
                if (phonePattern.test(data.phone_number)) {
                    return true;
                }
                else
                    return false;
            case "sap_id":
                const sapidPattern = RegExp(/^\d{7}|\d{8}$/);
                if (sapidPattern.test(data.sap_id)) {
                    return true;
                }
                else
                    return false;
            case "skill":

                if (rolename === 'SME' && data.SkillName === null)
                    return false;
                else
                    return true;
            case "role":
                    if (data.role_name !== null)
                        if (rolename === 'SME' && (data.SkillName === null || data.SkillName === '')){
                            return false;
                        }else{
                         return true;
                        }
                    else
                        return false;
            case "email":
                const emailPattern = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
                if (emailPattern.test(data.email)) {
                    return true;
                }
                else
                    return false;
            default:
                return false;
        }
    }


    componentDidMount() {
        this.props.getSMEList().then((response) => {
            if (response === undefined) {
                this.setState({
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: " Server is disconnected"
                })
            }
            else if (response && response.arrRes) {
                this.setState({
                    smeListVal: response.arrRes,
                    snackBarOpen: true,
                    snackvariant: 'success',
                    snackmsg: "User Data loaded successfully"
                })

            } else {
                this.setState({
                    smeListVal: [],
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: "Error in loading User Data"
                })
            }
        });
        this.getSkillList();
        this.getRoleList();
    }

    getRoleList = () => {
        this.props.getRoleList().then(response => {
              if(response === undefined) {
                  this.setState({
                      snackBarOpen: true,
                      snackvariant: 'error',
                      snakemsg: " Server is disconnected"
                  })
              }else if (response && response.errCode === 200){
                  const role = response.arrRes.map(rl =>{
                      return {
                          id: rl.id,
                          value: rl.id,
                          label: rl.role_name
                      }
                  });
                  this.setState({role});
                  this.setState({roles:role});
              }else{
                this.setState({ snackBarOpen: true, snackvariant: 'error', snackmsg: 'Something went Wrong. Please try again later.' })
              }
        })

    }

    getSkillList = () => {
        this.props.getSkillList().then(response => {
            if (response === undefined) {
                this.setState({
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: " Server is disconnected"
                })
            }
            else if (response && response.errCode === 200) {
                const skillList = response.arrRes.map(list => {
                    return {
                        value: list.id,
                        id: list.id,
                        label: list.skill_name
                    }
                });
                this.setState({ skillList });
            } else {
                this.setState({ snackBarOpen: true, snackvariant: 'error', snackmsg: 'Something went Wrong. Please try again later.' })
            }
        })
    }

    handleDelete = (id) => {
        const filteredItems = this.state.smeListVal.filter((item) => item.id !== id);
        const reqObj = {
            id: id,
            updated_by: 1
        }

        this.props.deleteSMEList(reqObj).then(response => {
            if (response === undefined) {
                this.setState({
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: " Server is disconnected"
                })
            }
            else if (response && response.errCode === 200) {
                this.setState({

                    smeListVal: filteredItems,
                    snackBarOpen: true,
                    snackmsg: "User deleted successfully",
                    snackvariant: 'success'
                });
            }
            else {
                this.setState({
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: "Error in User deletion"
                });
            }

        });
    }


    editSubmit = (newData, oldData) => {
        var skillIds = (newData.SkillName === oldData.SkillName) ? newData.skill_ids : newData.SkillName.map(skill => skill.id)

        const reqObj = {
            userid: newData.id,
            name: newData.name,
            email: newData.email,
            sapid: newData.sap_id,
            skills: skillIds,
            phone_number: newData.phone_number,
            role: newData.role_name.id ? newData.role_name.id : newData.role,
            updated_by: "1"
        }
        const filteredItems = this.state.skillList.filter(skill => reqObj.skills.includes(skill.id))
        const skillNames  = filteredItems.map(item => item.label);

        this.props.editSMEList(reqObj).then(response => {
            if (response === undefined) {
                this.setState({
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: " Server is disconnected"
                })
            }
            else if (response && response.errCode === 200) {
                let skills;
                let rlvalue ;
                 let rlnamevalue;

                 if(newData.role_name.label === 'SME' || newData.role_name === 'SME'){
                    skills = skillNames.toString()
                 }else{
                    skills = '';
                 }

                if(typeof newData.role_name == 'string'){
                    rlnamevalue = newData.role_name;
               }else if(typeof newData.role_name == 'object'){
                   rlnamevalue = newData.role_name.label;
               }else{
                     rlnamevalue = newData.role_name;
               }


                if(newData.role){
                    rlvalue = newData.role;
                if(typeof newData.role_name == 'object'){
                    rlvalue = newData.role_name.id;
                }
                }else if(!newData.role && newData.role_name.id){
                    rlvalue = newData.role_name.id;
                }else{
                    rlvalue = '';
                }
                 

                this.setState(prevState => ({
                    smeListVal: prevState.smeListVal.map(
                        el => el.id === newData.id ? {
                            ...el,
                            name: newData.name,
                            email: newData.email,
                            sap_id: newData.sap_id,
                            skill_ids: reqObj.skills,
                            SkillName: skills,
                            role_name:rlnamevalue,
                            role:rlvalue,
                            phone_number: newData.phone_number
                        } : el
                    )
                }))
    
                this.setState({
                    snackBarOpen: true,
                    snackmsg: "User Details updated successfully",
                    snackvariant: 'success'
                });
            }
            else if (response && response.errCode === 404) {
                this.setState({
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: " Failed in updating User Details "
                });
            }
            else {
                this.setState({
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: "Error in updating the User Details"
                });
            }
        });
    }

    handleModalSubmit = () => {
        const { formValues } = this.state;

        const reqObj = {
            name: formValues.smeName.value,
            sapid: formValues.sapId.value,
            phone_number: formValues.contactNumber.value,
            role: formValues.role.value,
            skills: formValues.skills.value,
            email: formValues.emailId.value,
            password: formValues.password.value,
            created_by: 1,
            updated_by: 1
        }

        const filteredItems = this.state.skillList.filter(skill => reqObj.skills.includes(skill.id))
        const skillNames = filteredItems.map(item => item.label);
        this.props.addSMEList(reqObj).then(response => {
            if (response === undefined) {
                this.setState({
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: " Server is disconnected"
                })
            }
            else if (response && response.errCode === 200) {

                const rolevalue = response.role_details;
            
                const myObj = {
                    id: response.arrRes,
                    name: formValues.smeName.value,
                    sap_id: formValues.sapId.value,
                    phone_number: formValues.contactNumber.value,
                    email: formValues.emailId.value,
                    skill_ids: reqObj.skills,
                    SkillName: skillNames.toString(),
                    role_name:rolevalue['role_name'],
                     role:reqObj.role
                }

                const updatedItems = [...this.state.smeListVal, myObj];

                this.setState({
                    formValues: { ...smeRegForm },
                    showAddSMEModal: false,
                    smeListVal: updatedItems,
                    snackBarOpen: true,
                    snackvariant: 'success',
                    snackmsg: "User added successfully!"
                })
            }
            else if (response && response.errCode === 404 && response.status === 'Email ID Already Exist')  {
                this.setState({
                    formValues: { ...smeRegForm },
                    showAddSMEModal: false,
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: "User Email Already exists!"
                })
            }
            else {
                this.setState({
                    showAddSMEModal: false,
                    snackBarOpen: true,
                    snackvariant: 'error',
                    snackmsg: "Error in adding User!"
                })
            }
        });
    };

    handleModalClose = () => {
        this.setState({ showAddSMEModal: false, formValues: { ...smeRegForm } })
    }

    onCloseSnackBar = () => {
        this.setState({ snackBarOpen: false });
    }

    inputFieldChange = (e) => {

        const targetName = e.target.name;
        const targetValue = e.target.value;
        const targetType = e.target.type ? e.target.type : '';

        const updatedRegForm = {
            ...this.state.formValues
        };
        const updatedFormElement = {
            ...updatedRegForm[targetName]
        };
        updatedFormElement.value = targetValue;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation, targetType, targetName);
        updatedRegForm[targetName] = updatedFormElement;
        let formIsValid = true;
        for (let inputIdentifier in updatedRegForm) {
            formIsValid = updatedRegForm[inputIdentifier].valid && formIsValid;
        }

        if(targetName === 'role'){
            if(e.target.label === 'SME'){
                this.setState({showSMEList: true});
            }else{
                this.setState({showSMEList: false});
            }
            this.setState({selectedRole: e.target});
        }

        if(targetName === 'password'){
                this.setState({'password' : targetValue});
                this.setState({'formValues.c_password': ''});  
        }
       
        if(targetName === 'c_password'){
            this.setState({'c_password' : targetValue});
            if(this.state.password === targetValue){
                this.setState({password_msg: null,ispassword_disable : false});
                
            }else{
                this.setState({password_msg: 'Password does not match please enter the correct password',ispassword_disable : true });
            }
        }
        this.setState({ formValues: updatedRegForm, formIsValid });

    }



    checkValidity(inputValue, rules, inputType, inputName) {
        if (inputValue) {
            const value = inputValue.toString();
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
            if (inputType === "email") {
                const pattern = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
                isValid = pattern.test(value) && isValid
            }
            if (inputName === "sapId") {
                const pattern = RegExp(/^\d{7}|\d{8}$/);
                isValid = pattern.test(value) && isValid
            }
            if (inputName === "contactNumber") {
                const pattern = RegExp(/^([+]\d{2})?\d{10}$/);
                isValid = pattern.test(value) && isValid
            }
            return isValid;
        }
    }

    render() {
        const { classes } = this.props;
        const { formIsValid, snackvariant, snackBarOpen, snackmsg, skillList, formValues,role,showSMEList,selectedRole,password_msg,ispassword_disable } = this.state;

        return (
            <div className="SMEList_container">
                <Dialog
                    disableBackdropClick
                    maxWidth="xs"
                    fullWidth={true}
                    open={this.state.showAddSMEModal}
                    onClose={this.handleModalClose}
                    aria-labelledby="SME-Name"
                >
                    <DialogTitle id="SME-Name">Add User Details</DialogTitle>
                    <DialogContent >
                        <div style={{ display: 'flex', flexDirection: "column" }}>
                            <Typography style={{ padding: '15px 15px 10px 0' }}>Name:</Typography>
                            <TextField
                                autoFocus
                                variant="outlined"
                                margin="dense"
                                placeholder="Name"
                                type="text"
                                name="smeName"
                                value={formValues.smeName.value}
                                onChange={this.inputFieldChange}
                            />
                            <Typography style={{ padding: '15px 15px 10px 0' }}>Sap Id:</Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                placeholder="Sap Id"
                                type="Number"
                                name="sapId"
                                value={formValues.sapId.value}
                                onChange={this.inputFieldChange}
                            />
                            <Typography style={{ padding: '15px 15px 10px 0' }}>Email Id:</Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                placeholder="Email Id"
                                type="email"
                                name="emailId"
                                value={formValues.emailId.value}
                                onChange={this.inputFieldChange}
                            />
                            <Typography style={{ padding: '15px 15px 10px 0' }}>Contact Number:</Typography>
                            <TextField
                                variant="outlined"
                                margin="dense"
                                placeholder="Contact Number"
                                type="Number"
                                name="contactNumber"
                                value={formValues.contactNumber.value}
                                onChange={this.inputFieldChange}
                            />
                            <Typography style={{ padding: '15px 15px 10px 0' }} >Select Role:</Typography>
                             <SelectOne
                                id="role"
                                name="role"
                                placeholder="Role"
                                options={role}
                                onChange={this.inputFieldChange}                                
                                value={selectedRole ? selectedRole : null}
                              />  
                              { showSMEList &&
                                <div>
                                 <Typography style={{ padding: '15px 15px 10px 0' }}>Select Skills:</Typography>
                                 <SelectOne
                                     id="skills"
                                     name="skills"
                                     placeholder="Skills"
                                     value={formValues.skills && formValues.skills.value}
                                     isMulti={true}
                                     options={skillList}
                                     onChange={this.inputFieldChange}
                                 />
                                </div> 
                                 }
                     <Typography style={{ padding: '15px 15px 10px 0' }}>Password:</Typography>
                        <TextField
                            variant="outlined"
                            margin="dense"
                            placeholder="Password"
                            name="password"
                            id="outlined-error-helper-text"
                            type="password"
                            value={formValues.password && formValues.password.value}
                            onChange={this.inputFieldChange}
                        />

                       <Typography style={{ padding: '15px 15px 10px 0' }}>Confirm Password:</Typography>
                        <TextField
                            variant="outlined"
                            margin="dense"
                            placeholder="Confirm Password"
                            type="password"
                            name="c_password"
                            id="outlined-error-helper-text"
                            //helperText = {password_msg === "" ? null : password_msg }
                            value={formValues.c_password && formValues.c_password.value}
                            onChange={this.inputFieldChange}
                        />  
                        <span style={{color: 'red'}}>{password_msg === "" ? null : password_msg }</span>
     
                     </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleModalClose} variant="contained" color="primary">
                            Cancel
                </Button>
                        
                        <Button onClick={this.handleModalSubmit} disabled={!formIsValid && ispassword_disable} variant="contained" color="primary">
                            Submit
                </Button>
                    </DialogActions>
                </Dialog>
                <Paper className={classes.paperRoot} elevation={3}>
                    <Typography variant="h4" className="text-center" gutterBottom>
                        User List
            </Typography>
                    <MaterialTable
                        title=""
                        columns={this.columnFields}
                        data={this.state.smeListVal}
                        style={{ boxShadow: 'none', border: 'solid 1px #ccc' }}
                        options={{
                            actionsColumnIndex: -1,
                            pageSizeOptions: []
                        }}
                        actions={[
                            {
                                icon: 'add',
                                tooltip: 'Add User Data',
                                isFreeAction: true,
                                onClick: (event) => this.setState({ showAddSMEModal: true })
                            },
                        ]}
                        editable={{
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve) => {
                                    resolve();
                                    if (oldData) {
                                        this.editSubmit(newData, oldData);
                                    }
                                }),
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    resolve();
                                    this.handleDelete(oldData.id);
                                })
                        }}
                    />
                    {snackBarOpen &&
                        <SnackBar onCloseSnackBar={this.onCloseSnackBar} snackBarOpen={snackBarOpen} snackmsg={snackmsg} snackvariant={snackvariant} />}
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(SMEList);