import React from 'react'; // eslint-disable-line no-unused-vars
import './transaction.css';
import {gweiToEther} from '../../helper';
import {TX_BLACK_ETHER} from '../../config';
import Parameter from './../parameter/parameter'
export default ({
  data,
  onSelect,
  onClick,
  fromHighlight,
  fromColor,
  toHighlight,
  toColor
}) => {
  const {input, hash, value, to, from} = data;
  const hasInput = input.length > 3;
  const isFrom = fromHighlight === from;
  const isTo = toHighlight === to;
  const etherValue = Math.min(gweiToEther(value), TX_BLACK_ETHER);
  const luminance = Math.max(8, Math.round(etherValue / TX_BLACK_ETHER * 20));
  let color = `hsla(1, 0%, ${100 - luminance}%, 1)`;

  if (isFrom) {
    color = fromColor;
  }

  if (isTo) {
    color = toColor;
  }

  const classes = [
    'transaction',
    hasInput && 'transaction--input',
    !to && 'transaction--create'
  ]
    .filter(Boolean)
    .join(' ');

if(data.method) {
  return (
    <div
      classes={classes}
      style={{backgroundColor: color}}
      onClick={() => onSelect(hash)}
      onMouseLeave={() => onSelect(null)}
    >

      { data.to.substring(0, 10) }.{data.method.name }({data.method.params.map((param) => { return <Parameter parameter={param} /> }) } { data.value !== 0 && gweiToEther(data.value).toPrecision(2) } { data.value !== 0 && 'ETH' })
    </div>

  );
} else {
  return <span />
}
};
