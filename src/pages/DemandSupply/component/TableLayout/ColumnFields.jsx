import React from 'react';

const FullViewFields = [
    {
        title: "Name",
        name: 'name',
        field: "candidate_name",
        hide: false
    },
    {
        title: "Email",
        name: 'email',
        field: "email_id",
        hide: false
    },
    {
        title: "Contact",
        name: 'contact',
        field: "contact",
        hide: false
    },
    {
        title: "Total Experience",
        name: 'totalExperience',
        field: "total_experience",
        hide: false
    },
    {
        title: "Relavent Experience",
        name: 'relevantExperience',
        field: "relevant_experience",
        hide: false
    },
    {
        title: "Last Interview Status",
        name: 'interviewStatus',
        field: "feedback",
        hide: false,
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
        hide: false,
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
        hide: false,
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
        hide: false
    },
    {
        title: "Notice Period",
        field: "notice_period",
        name: 'noticePeriod',
        hide: false
    },
    {
        title: "Current Location",
        field: "current_location",
        name: 'currentLocation',
        hide: false
    },
    {
        title: "Prefered Location",
        field: "preferred_location",
        name: 'preferredLocation',
        hide: false
    },
    {
        title: "HackerRank Score",
        field: "hr_score",
        name: 'hrScore',
        hide: false
    },
    {
        title: "HackerRank Remarks",
        name: 'hrRemarks',
        field: "hr_remarks",
        hide: false
    },
    {
        title: "SPOC",
        field: "spoc_name",
        name: 'spoc',
        hide: false
    },
    {
        title: "Recruiter",
        field: "recruiter",
        name: 'recuiter',
        hide: false
    },
    {
        title: "Primary Skill",
        field: "primary_skill",
        name: 'primarySkill',
        hide: false
    },
    {
        title: "Secondary Skill",
        field: "secondary_skill",
        name: 'secondarySkill',
        hide: false
    },
];
const HistoryViewFields = [
    {
        title: "Name",
        name: 'name',
        field: "candidate_name",
        hide: false
    },
    {
        title: "Email",
        name: 'email',
        field: "email_id",
        hide: false
    },
    {
        title: "Contact",
        name: 'contact',
        field: "contact",
        hide: false
    },
    {
        title: "Total Experience",
        name: 'totalExperience',
        field: "total_experience",
        hide: false
    },
    {
        title: "Relavent Experience",
        name: 'relevantExperience',
        field: "relevant_experience",
        hide: false
    },
    {
        title: "Current Company",
        field: "current_company",
        name: 'currentCompany',
        hide: false
    },
    {
        title: "Notice Period",
        field: "notice_period",
        name: 'noticePeriod',
        hide: false
    },
    {
        title: "Current Location",
        field: "current_location",
        name: 'currentLocation',
        hide: false
    },
    {
        title: "Prefered Location",
        field: "preferred_location",
        name: 'preferredLocation',
        hide: false
    },
    {
        title: "Primary Skill",
        field: "primary_skill",
        name: 'primarySkill',
        hide: false
    },
    {
        title: "Secondary Skill",
        field: "secondary_skill",
        name: 'secondarySkill',
        hide: false
    },
];

const BasicViewFields = [
    {
        title: "Name",
        name: 'name',
        field: "candidate_name",
        hide: false
    },
    {
        title: "Email",
        name: 'email',
        field: "email_id",
        hide: false
    },
    {
        title: "Contact",
        name: 'contact',
        field: "contact",
        hide: false
    },
    {
        title: "Last Interview Status",
        name: 'interviewStatus',
        field: "feedback",
        hide: false,
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
        hide: false
    },
    {
        title: "Secondary Skill",
        field: "secondary_skill",
        name: 'secondarySkill',
        hide: false
    }
];

const RecruiterViewFields = [
    {
        title: "Name",
        name: 'name',
        field: "candidate_name",
        hide: false
    },
    {
        title: "Last Interview Status",
        name: 'interviewStatus',
        field: "feedback",
        hide: false,
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
        hide: false,
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
        hide: false,
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
        hide: false
    },
    {
        title: "Total Experience",
        name: 'totalExperience',
        field: "total_experience",
        hide: false
    },
    {
        title: "HackerRank Score",
        field: "hr_score",
        name: 'hrScore',
        hide: false
    },
    {
        title: "HackerRank Remarks",
        name: 'hrRemarks',
        field: "hr_remarks",
        hide: false
    }
];


const SPOCViewFields = [
    {
        title: "Name",
        name: 'name',
        field: "candidate_name",
        hide: false
    },
    {
        title: "SPOC",
        field: "spoc_name",
        name: 'spoc',
        hide: false
    },
    {
        title: "Last Interview Status",
        name: 'interviewStatus',
        field: "feedback",
        hide: false,
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
        hide: false,
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
        hide: false,
        render: (rowData) => {
            let display = rowData.feedback !== null && rowData.feedback.length > 0 ?
                rowData.feedback[rowData.feedback.length - 1].interview_schedule_dt : '-'
            return <div>{display.split(' ')[0]}</div>
        },
    }
];

export default {FullViewFields, HistoryViewFields, BasicViewFields, RecruiterViewFields, SPOCViewFields};