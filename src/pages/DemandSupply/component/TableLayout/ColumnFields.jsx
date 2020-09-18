import React from 'react';

const FullViewFields = [
    {
        title: "Name",
        name: 'name',
        field: "candidate_name",
    },
    {
        title: "Email",
        name: 'email',
        field: "email_id",
    },
    {
        title: "Contact",
        name: 'contact',
        field: "contact",
    },
    {
        title: "Total Experience",
        name: 'totalExperience',
        field: "total_experience",
    },
    {
        title: "Relavent Experience",
        name: 'relevantExperience',
        field: "relevant_experience",
    },
    {
        title: "Last Interview Status",
        name: 'interviewStatus',
        field: "feedback",
        render: (rowData) => {
            let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
                rowData.feedback[rowData.feedback.length - 1].status_name : '-'
            return <div>{display}</div>
        },
    },
    {
        title: "Last Interview Panel",
        name: 'interviewPanel',
        field: "feedback",
        render: (rowData) => {
            let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
                rowData.feedback[rowData.feedback.length - 1].interview_level : '-'
            return <div>{display}</div>
        },
    },
    {
        title: "Last Interview  Date",
        name: 'interviewDate',
        field: "feedback",
        render: (rowData) => {
            let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
                rowData.feedback[rowData.feedback.length - 1].interview_schedule_dt : '-'
            return <div>{display.split(' ')[0]}</div>
        },
    },
    {
        title: "Current Company",
        field: "current_company",
        name: 'currentCompany',
    },
    {
        title: "Notice Period",
        field: "notice_period",
        name: 'noticePeriod',
    },
    {
        title: "Current Location",
        field: "current_location",
        name: 'currentLocation',
    },
    {
        title: "Prefered Location",
        field: "preferred_location",
        name: 'preferredLocation',
    },
    {
        title: "HackerRank Score",
        field: "hr_score",
        name: 'hrScore',
    },
    {
        title: "HackerRank Remarks",
        name: 'hrRemarks',
        field: "hr_remarks",
    },
    {
        title: "SPOC",
        field: "spoc_name",
        name: 'spoc',
    },
    {
        title: "Recruiter",
        field: "recruiter",
        name: 'recuiter',
    },
    {
        title: "Primary Skill",
        field: "primary_skill",
        name: 'primarySkill',
    },
    {
        title: "Secondary Skill",
        field: "secondary_skill",
        name: 'secondarySkill',
    },
];
const HistoryViewFields = [
    {
        title: "Name",
        name: 'name',
        field: "candidate_name",
    },
    {
        title: "Email",
        name: 'email',
        field: "email_id",
    },
    {
        title: "Contact",
        name: 'contact',
        field: "contact",
    },
    {
        title: "Total Experience",
        name: 'totalExperience',
        field: "total_experience",
    },
    {
        title: "Relavent Experience",
        name: 'relevantExperience',
        field: "relevant_experience",
    },
    {
        title: "Current Company",
        field: "current_company",
        name: 'currentCompany',
    },
    {
        title: "Notice Period",
        field: "notice_period",
        name: 'noticePeriod',
    },
    {
        title: "Current Location",
        field: "current_location",
        name: 'currentLocation',
    },
    {
        title: "Prefered Location",
        field: "preferred_location",
        name: 'preferredLocation',
    },
    {
        title: "Primary Skill",
        field: "primary_skill",
        name: 'primarySkill',
    },
    {
        title: "Secondary Skill",
        field: "secondary_skill",
        name: 'secondarySkill',
    },
];

const BasicViewFields = [
    {
        title: "Name",
        name: 'name',
        field: "candidate_name",
    },
    {
        title: "Email",
        name: 'email',
        field: "email_id",
    },
    {
        title: "Contact",
        name: 'contact',
        field: "contact",
    },
    {
        title: "Last Interview Status",
        name: 'interviewStatus',
        field: "feedback",
        render: (rowData) => {
            let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
                rowData.feedback[rowData.feedback.length - 1].status_name : '-'
            return <div>{display}</div>
        },
    },
    {
        title: "Primary Skill",
        field: "primary_skill",
        name: 'primarySkill',
    },
    {
        title: "Secondary Skill",
        field: "secondary_skill",
        name: 'secondarySkill',
    }
];

const RecruiterViewFields = [
    {
        title: "Name",
        name: 'name',
        field: "candidate_name",
    },
    {
        title: "Last Interview Status",
        name: 'interviewStatus',
        field: "feedback",
        render: (rowData) => {
            let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
                rowData.feedback[rowData.feedback.length - 1].status_name : '-'
            return <div>{display}</div>
        },
    },
    {
        title: "Last Interview Panel",
        name: 'interviewPanel',
        field: "feedback",
        render: (rowData) => {
            let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
                rowData.feedback[rowData.feedback.length - 1].interview_level : '-'
            return <div>{display}</div>
        },
    },
    {
        title: "Last Interview  Date",
        name: 'interviewDate',
        field: "feedback",
        render: (rowData) => {
            let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
                rowData.feedback[rowData.feedback.length - 1].interview_schedule_dt : '-'
            return <div>{display.split(' ')[0]}</div>
        },
    },
    {
        title: "Recruiter",
        field: "recruiter",
        name: 'recuiter',
    },
    {
        title: "Total Experience",
        name: 'totalExperience',
        field: "total_experience",
    },
    {
        title: "HackerRank Score",
        field: "hr_score",
        name: 'hrScore',
    },
    {
        title: "HackerRank Remarks",
        name: 'hrRemarks',
        field: "hr_remarks",
    }
];


const SPOCViewFields = [
    {
        title: "Name",
        name: 'name',
        field: "candidate_name",
    },
    {
        title: "SPOC",
        field: "spoc_name",
        name: 'spoc',
    },
    {
        title: "Last Interview Status",
        name: 'interviewStatus',
        field: "feedback",
        render: (rowData) => {
            let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
                rowData.feedback[rowData.feedback.length - 1].status_name : '-'
            return <div>{display}</div>
        },
    },
    {
        title: "Last Interview Panel",
        name: 'interviewPanel',
        field: "feedback",
        render: (rowData) => {
            let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
                rowData.feedback[rowData.feedback.length - 1].interview_level : '-'
            return <div>{display}</div>
        },
    },
    {
        title: "Last Interview  Date",
        name: 'interviewDate',
        field: "feedback",
        render: (rowData) => {
            let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
                rowData.feedback[rowData.feedback.length - 1].interview_schedule_dt : '-'
            return <div>{display.split(' ')[0]}</div>
        },
    }
];

export default {FullViewFields, HistoryViewFields, BasicViewFields, RecruiterViewFields, SPOCViewFields};