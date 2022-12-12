import Select from 'react-dropdown-select';

const BACK_URL = process.env.REACT_APP_BACK_URL;
const BACK_PASS = process.env.REACT_APP_BACK_PASS;
const url = BACK_URL + 'locations?pass=' + BACK_PASS;

const locations = []

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    for (let i=0; i < data.length; i++) {
        locations.push({
            label: data[i].name,
            value: data[i].name
        })
    }
  })

export function MySelect(props){  
  return (
    <Select
      options={locations}
      onChange={props.onChange}
    />
  )
};
