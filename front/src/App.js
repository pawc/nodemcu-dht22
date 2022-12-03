import './App.css';
import { MySelect } from './components/MySelect';
import MyDateTimePicker from './components/MyDateTimePicker';
import React from 'react';
import dateFormat from 'dateformat';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const BACK_URL = process.env.REACT_APP_BACK_URL;
const BACK_PASS = process.env.REACT_APP_BACK_PASS;

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      dateStart: new Date(),
      dateEnd: new Date(),
      locations: new Object({}),
      chartData: {
        "labels": [],
        "datasets": [],
      }
    }

  }

  handleChangeDateStart = date => {
    this.setState({
      dateStart: date
    }, () => this.updateChart())
  }

  handleChangeDateEnd = date => {
    this.setState({
      dateEnd: date
    }, () => this.updateChart())
  }

  formatDate = date => {
    let datePart = dateFormat(date, "yyyy-mm-dd");
    let timePart = dateFormat(date, "HH:MM");
    return datePart + 'T' + timePart;
  }

  updateChart = () => {
    let start = this.formatDate(this.state.dateStart);
    let end = this.formatDate(this.state.dateEnd);
    if(this.state.locations.length > 0){

      let labels = []
      let datasets = []

      for(let i=0; i<this.state.locations.length; i++){
        let url2Call = BACK_URL + this.state.locations[i].value 
          + '?start=' + start + '&end=' + end + '&pass=' + BACK_PASS;

        fetch(url2Call)
        .then((response) => response.json())
        .then((data) => {
          
          let newLabels = data.map(row => row.timestamp)
          for(let j=0; j<newLabels.length; j++){
            if(labels.indexOf(newLabels[j]) === -1) labels.push(newLabels[j]);
          }

          datasets.push(
            {
              label: 'Temperature ' + this.state.locations[i].value,
              data: data.map(row => row.temperature),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              yAxisID: 'y'
            }
          )

          datasets.push(
            {
              label: 'Humidity ' + this.state.locations[i].value,
              data: data.map(row => row.humidity),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              yAxisID: 'y1'
            }
          )

          this.setState({
            chartData: {
              labels: labels.sort().map(label => label.substring(0, label.length-3).replace('T', ' ')),
              datasets: datasets
            }
          }, () => {console.log(this.state.chartData)})
        })
         
      }
    }

  }

  handleChangeSelect = val => {
    this.setState({
      locations: val
    }, () => this.updateChart())
  }

  render = () => {

    const options = {
      responsive: true,
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',

          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        }
      }
    };

    return (
      <div className="App">
        <MySelect onChange={this.handleChangeSelect}/>
        <MyDateTimePicker 
          dateVal={this.state.dateStart} 
          handleChange={this.handleChangeDateStart}/>
        <MyDateTimePicker 
          dateVal={this.state.dateEnd} 
          handleChange={this.handleChangeDateEnd}/>
          <Line options={options} data={this.state.chartData} />
      </div>
    );
  }

}

export default App;
