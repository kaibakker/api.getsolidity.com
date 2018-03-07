import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import './parameter.css';


class Parameter extends Component {
  constructor(props) {
    super(props);
    // console.log(props)
    this.state = {
      type: props.parameter.type,
      value: props.parameter.value,
      name: props.parameter.name,
    };
  }
  getValue() {
    if(this.state.type === 'address') {
      // if(this.state.value.substring(0, 10) == '0x00000000') {
      //   return "Null Address"
      // } else {
      //   return this.state.value.substring(0, 10)
      // }
      return this.state.name

    } else if(this.state.type === 'bytes32') {
      return this.state.name
    } else if(this.state.type === 'bytes32') {
      return this.state.name
    } else if(typeof(this.state.value) === 'string'){
      return this.state.value
    }
  }

  render() {
    console.log(this.state)
    return <span> { this.state.name } </span>
  }
}
export default Parameter;
