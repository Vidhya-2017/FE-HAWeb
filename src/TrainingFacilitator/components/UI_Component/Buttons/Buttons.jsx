import React from 'react';
import Button from 'react-bootstrap/Button';
import './Buttons.scss'
class Buttons extends React.Component{
    
    render() {
        return (
        <>            
        <Button  
        className={`btn btn-primary ${this.props.className}`}   
        value={this.props.value}
        disabled={this.props.disabled}
        onClick={this.props.onClick}
        >
            {this.props.value}
        </Button>      
        </>
        )
    }
}
  

export default Buttons;