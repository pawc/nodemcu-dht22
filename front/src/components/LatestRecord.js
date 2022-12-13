import React from 'react';

export default function LatestRecord(props){

    return (
        <div>
            <p>Ostatni odczyt od <b>{props.location}</b></p>   
            <p>{props.date} godz. {props.time}</p>
            <p>Temperatura: {props.temperature} C</p>
            <p>Wilgotność: {props.humidity} %</p>
        </div>
    )

}