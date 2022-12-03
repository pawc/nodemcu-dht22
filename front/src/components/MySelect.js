import Select from 'react-dropdown-select';

const BACK_URL = process.env.REACT_APP_BACK_URL;
const BACK_PASS = process.env.REACT_APP_BACK_PASS;
const url = BACK_URL + 'locations?pass=' + BACK_PASS;

const locations = []

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    console.log(data.length)
    for (let i=0; i < data.length; i++) {
        locations.push({
            label: data[i].name,
            value: data[i].name
        })
    }
    console.log(locations)
  })

export function MySelect(props){  
  return (
    <Select
      multi
      options={locations}
      onChange={props.onChange}
    />
  )
};
