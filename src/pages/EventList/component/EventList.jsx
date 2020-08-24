import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import Container from 'react-bootstrap/Container';
import { Toast } from 'react-bootstrap';
import '../scss/EventList.scss';

class EventList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      toastMsg: '',
      eventList: [],

    }
  }

  componentDidMount() {
    this.props.getEventList().then((response) => {
      if (response && response.errCode === 200) {
        this.setState({
          eventList: response.arrRes,

        })
      } else {
        this.setState({
          eventList: '',
          showToast: true, toastMsg: 'Something went Wrong. Please try again later.'
        })

      }
    });

  }
  render() {
    const headerSortingStyle = { backgroundColor: '#c8e6c9' };
    const { eventList, showToast, toastMsg } = this.state;
    const sizePerPageRenderer = ({ }) => (
      <div className="btn-group recordPerPage" role="group">
      </div>
    );
    const paginationOptions = {
      sizePerPageRenderer,
      sizePerPage: 5

    };
    const cols = [
      {
        dataField: 'EventName',
        text: 'Event Name',
        sort: true,
        headerSortingStyle
      },
      {
        dataField: 'Location',
        text: 'Event Location',
        sort: true,
        headerSortingStyle
      },
      {
        dataField: 'ClientName',
        text: 'Client Name',
        sort: true,
        headerSortingStyle
      },
      {
        dataField: 'Date',
        text: 'Date',
        sort: true,
        headerSortingStyle
      },
      {
        dataField: 'Duration',
        text: 'Duration',
        sort: true,
        headerSortingStyle
      },
      {
        dataField: 'AssessScale',
        text: 'No of Sprint',
        sort: true,
        headerSortingStyle
      },
      {
        dataField: 'skill_name',
        text: 'Skill List',
        sort: true,
        headerSortingStyle
      },
      {
        dataField: 'CompetancyRating',
        text: 'Compentency Rating',
        sort: true,
        headerSortingStyle
      },
      {
        dataField: 'OtherAssessScale',
        text: 'Assessing Parameter',
        sort: true,
        headerSortingStyle
      },


    ];
    const { SearchBar } = Search;
    return (
      <div className="EventList_container">
        <section>
          <Container>
            <h2>Event List</h2>
            <ToolkitProvider
              keyField="EventID"
              data={eventList}
              columns={cols}
              search
            >
              {
                props => (
                  <div>
                    <div className="float-right">
                      <SearchBar {...props.searchProps}
                      />
                    </div>
                    <div className="pt-5">
                      <BootstrapTable
                        {...props.baseProps}
                        id="bar"
                        pagination={paginationFactory(paginationOptions)}
                      />
                    </div>
                  </div>
                )
              }
            </ToolkitProvider>
          </Container>
        </section>
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
      </div>
    )
  }
}

export default EventList;