import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TableCell from '@material-ui/core/TableCell';
import Cell from '../Table/Cell'
import { TablePagination } from '@material-ui/core';
import Search from '../Search/Search'
import CustomisedMenu from '../StyledMenu/StyledMenu'
//import Pagination from '@material-ui/lab/Pagination';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from "@material-ui/core/styles";
import Table from '../Table/Table';


const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },

});


const sort_by = (field, reverse, primer) => {
    const key = primer ?
        function (x) {
            return primer(x[field])
        } :
        function (x) {
            return x[field]
        };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
}




export class Layout extends Component {

    constructor(props) {
        super(props)

        this.state = {
            sortField: 'name',
            sortType: 'asc',
            page: 0,
            rowsPerPage: 5,
            enableEditIcon: false,
            test: props.statements,
            enableDeleteIcon: false,
            actualData: []
        }
    }


    _handleSort = (name, cellType, sortType) => {
        const { actualData } = this.state

        let tableData = actualData.sort(sort_by(name, sortType == 'asc' ? false : true))

        this.setState({
            sortField: name,
            sortType: sortType,
            actualData: tableData
        })
    }
    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.statements !== nextProps.statements) {
            this.setState({
                actualData: nextProps.statements
            })
        }
    }


    renderTableHeader = () => {
        const { sortField, sortType } = this.state
        return (
            <TableRow style={{ color: 'white !important' }} >
                <TableCell> Select</TableCell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='candidate_name' style={{ width: '100px' }}>Name</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='contact' style={{ width: '100px' }}>Contact</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='email_id' style={{ width: '100px' }}>Email</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='total_experience' style={{ width: '50px' }}>Total Experience</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='relevant_experience' style={{ width: '50px' }}>Relevent Experience</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='current_company' style={{ width: '100px' }}>Current Company</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='notice_period' style={{ width: '100px' }}>Notice Periods</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='current_location' style={{ width: '50px' }}>Current Location</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='preferred_location' style={{ width: '50px' }}>Preferred Location</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='hr_test_taken' style={{ width: "10px" }}> Hacker Rank</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='hr_score' > HackerRankScore</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={false} name='hr_remarks' >Hacker Rank Remarks</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='spoc_name' >SPOC</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='recruiter' >Recruiter</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='primary_skill' >Primary</Cell>
                <Cell cellType='text' sortField={sortField} sortType={sortType} handleSort={this._handleSort} sort={true} name='secondary_skill' >Secondary</Cell>
            </TableRow>
        )
    }

    renderTableBody = (statements) => {

        let { actualData, page, rowsPerPage } = this.state;

        let tableData = actualData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

        return (
            <React.Fragment>
                {
                    tableData.map((statement, i) => (
                        <TableRow key={statement.transactionId}>
                            <Cell sort={false} ><input type='checkbox' onChange={() => { this.onSelectCandidate((page * rowsPerPage) + i) }} checked={statement.checked} /></Cell>
                            <Cell sort={false} style={{ whiteSpace: 'nowrap' }}>{statement.candidate_name}</Cell>
                            <Cell sort={false} >{statement.contact}</Cell>
                            <Cell sort={false} >{statement.email_id}</Cell>
                            <Cell sort={false} >{statement.total_experience}</Cell>
                            <Cell sort={false} >{statement.relevant_experience}</Cell>
                            <Cell sort={false} >{statement.current_company}</Cell>
                            <Cell sort={false}> {`${statement.notice_period} days`}</Cell>
                            <Cell sort={false} >{statement.current_location}</Cell>
                            <Cell sort={false} >{statement.preferred_location}</Cell>
                            <Cell sort={false} ><input type='checkbox' disabled={1} checked={statement.hr_test_taken} /></Cell>
                            <Cell sort={false} >{statement.hr_test_taken ? statement.hr_score : 'NA'}</Cell>
                            <Cell sort={false} >{statement.hr_test_taken ? statement.hr_remarks : 'NA'}</Cell>
                            <Cell sort={false}>{statement.spoc_name}</Cell>
                            <Cell sort={false} >{statement.recruiter}</Cell>
                            <Cell sort={false} >{statement.primary_skill}</Cell>
                            <Cell sort={false} >{statement.secondary_skill}</Cell>
                        </TableRow>

                    ))
                }
            </React.Fragment>
        )
    }


    onSelectCandidate = (i) => {
        const { actualData } = this.state

        if (actualData[i].checked == undefined || actualData[i].checked == false) {
            actualData[i].checked = true;
        } else {
            actualData[i].checked = false;
        }

        let status = actualData.filter((data) => {
            return data.checked != undefined && data.checked
        })

        this.setState({
            actualData,
            enableEditIcon: status.length == 1 ? true : false,
            enableDeleteIcon: status.length > 0 ? true : false,
        })
    }

    handleChangePage = (event, page) => {
        this.setState({
            page
        })
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            page: 0,
            rowsPerPage: event.target.value
        })
    };

    _handleDelete = () => {

        const { actualData } = this.state
        const filteredData = actualData.filter((data) => {
            return data.checked !== undefined && data.checked
        })

        let candidateIds = filteredData .map((data, i) => {
            return data.candidate_id
        })

        console.log(filteredData)
        let reqObj = {
            candidate_id: candidateIds.toString()
        }

        this.props.deleteCandidate(reqObj).then((res) => {
            if (res.errCode === 201) {
                this.props.getCandidateData()
                this.setState({
                    page: 0,
                    enableEditIcon: false,
                    enableDeleteIcon: false,
                })
            }
        })

    }

    navToCandidate = () => {
        this.props.history.push('/createCandidate');
    }

    changeCandidateInterviewStatus = async (status) => {
        const { actualData } = this.state
        const { changeCandidateInterviewStatus } = this.props

        const filteredData = actualData.filter((data) => {
            return data.checked != undefined || data.checked
        })

        changeCandidateInterviewStatus(filteredData, status)

    }

    render() {
        const { classes, getCandidateData } = this.props
        const { page, rowsPerPage, actualData, enableEditIcon, enableDeleteIcon } = this.state
        return (
            <React.Fragment>
                <Search getCandidateData={getCandidateData} />
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.button}
                    onClick={this.navToCandidate}
                >
                    Add
                 </Button>

                <Button
                    variant="contained"
                    color="primary"
                    disabled={!enableEditIcon}
                    size="small"
                    className={classes.button}
                    endIcon={<EditIcon />}

                >
                    Edit
                 </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    disabled={!enableDeleteIcon}
                    size="small"
                    className={classes.button}
                    startIcon={<DeleteIcon />}
                    onClick={this._handleDelete}
                >
                    Delete
                </Button>

                <CustomisedMenu buttonName='TP1 Status'
                    status={[
                        { title: 'TP1 Feedback Pending' },
                        { title: 'TP1 On hold' },
                        { title: 'TP1 Pending' },
                        { title: 'TP1 Reject' },
                        { title: 'TP1 Scheduled' },
                    ]}
                    classes={classes}
                    disabled={!enableDeleteIcon}
                />

                <CustomisedMenu buttonName='TP2 Status'
                    status={[
                        { title: 'TP2 Feedback Pending' },
                        { title: 'TP2 On hold' },
                        { title: 'TP2 Pending' },
                        { title: 'TP2 Reject' },
                        { title: 'TP2 Scheduled' },
                    ]}
                    classes={classes}
                    disabled={!enableDeleteIcon}
                />

                <CustomisedMenu buttonName='Fitment Status'
                    status={[
                        { title: 'Fitment On hold', interview_status: 9 },
                        { title: 'Fitment Reject', interview_status: 10 },
                        { title: 'Fitment WIP', interview_status: 11 },
                    ]}
                    classes={classes}
                    changeCandidateInterviewStatus={this.changeCandidateInterviewStatus}
                    disabled={!enableDeleteIcon}
                />
                <CustomisedMenu buttonName='Offer Status'
                    status={[
                        { title: 'Offer On hold', interview_status: 14 },
                        { title: 'Offer WIP', interview_status: 21 },
                        { title: 'Offered', interview_status: 15 },
                        { title: 'Joined', interview_status: 20 },
                    ]}
                    changeCandidateInterviewStatus={this.changeCandidateInterviewStatus}
                    classes={classes}
                    disabled={!enableDeleteIcon}
                />
                <CustomisedMenu buttonName='Drop Status'
                    status={[
                        { title: 'Client Reject' },
                        { title: 'Demand Dropped' },
                        { title: 'Dropped' },
                    ]}
                    classes={classes}
                    disabled={!enableDeleteIcon}
                />

                <Table classes={classes} tableHeader={this.renderTableHeader()} tableBody={this.renderTableBody()} />
                <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    component="div"
                    count={actualData.length}
                    page={page}
                    onChangePage={this.handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />


            </React.Fragment>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Layout);

