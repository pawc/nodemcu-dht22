import DateTimePicker from 'react-datetime-picker';

export default function MyDateTimePicker(props) {

  return (
    <div>
      <DateTimePicker onChange={props.handleChange} value={props.dateVal} />
    </div>
  );
  
}