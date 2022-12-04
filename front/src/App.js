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
import GridLayout from "react-grid-layout";

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

    let pathName = window.location.pathname;
    pathName = pathName.substring(1, pathName.length)

    let dateStart = new Date(new Date().setHours(new Date().getHours() - 5));

    let locations = []
    if(pathName){
      locations.push({
        label: pathName,
        value: pathName
      })
    }

    this.state = {
      dateStart: dateStart,
      pathName: pathName,
      dateEnd: new Date(),
      locations: locations,
      chartData: {
        "labels": [],
        "datasets": [],
      }
    }

    this.updateChart()

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
          })
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

    const layout = [
      { i: "selectDiv", x: 0, y: 0, w: 2, h: 2, static: true, isDraggable: false },
      { i: "dateStartDiv", x: 2, y: 0, w: 3, h: 2, isDraggable: false  },
      { i: "dateEndDiv", x: 5, y: 0, w: 2, h: 2, isDraggable: false  }
    ];

    return (
      <div className="App">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1200}
        >
        <div key="selectDiv">
          <MySelect onChange={this.handleChangeSelect} value={this.state.pathName}/>
        </div>
        <div key="dateStartDiv">
          <MyDateTimePicker 
            dateVal={this.state.dateStart} 
            handleChange={this.handleChangeDateStart}/>
        </div>  
        <div key="dateEndDiv">
          <MyDateTimePicker 
            dateVal={this.state.dateEnd} 
            handleChange={this.handleChangeDateEnd}/>
        </div>
        </GridLayout>
        <Line options={options} data={this.state.chartData} />
      </div>
    );
  }

}

export default App;
