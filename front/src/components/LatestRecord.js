import React from 'react';

const BACK_URL = process.env.REACT_APP_BACK_URL;
const BACK_PASS = process.env.REACT_APP_BACK_PASS;

class LatestRecord extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            location: props.location,
            downloaded: false
        } 
    }

    render = () => { 

        if(!this.state.downloaded){
            fetch(BACK_URL  + this.state.location + '/latest?pass=' + BACK_PASS)
            .then((response) => response.json())
            .then((data) => {
                let date = data.timestamp.substring(0, data.timestamp.length-3).replace('T', ' ').split(' ')[0]
                let time = data.timestamp.substring(0, data.timestamp.length-3).replace('T', ' ').split(' ')[1]
                this.setState({
                    location: data.location.name,
                    date: date,
                    time: time,
                    temperature: data.temperature,
                    humidity: data.humidity,
                    downloaded: true
                })
            })
        }

        return (
            <div>
                <p>Ostatni odczyt od <b>{this.state.location}</b></p>
                <p>{this.state.date}</p>
                <p>{this.state.time}</p>
                <p>Temperatura: {this.state.temperature} C</p>
                <p>Wilgotność: {this.state.humidity} %</p>
            </div>
        )

    }


}

export default LatestRecord