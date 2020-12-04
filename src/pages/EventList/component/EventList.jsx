import React from 'react';
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
    return (
      <div className="EventList_container">
      Under Construction
      </div>
    )
  }
}

export default EventList;