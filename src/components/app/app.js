import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import './app.css';
import Account from '../account/account';
import Chain from '../chain/chain';
import Menu from '../menu/menu';
import {MENU_OPTIONS} from '../../config';

import TagsInput from 'react-tagsinput'

import './react-tagsinput.css' // If using WebPack and style-loader.

class Example extends React.Component {
  constructor() {
    super()
    this.state = {tags: []}
  }


}



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
      options: MENU_OPTIONS,
      tags: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(tags) {
    this.setState({tags})
  }
  render() {
    return (
      <div className="app">
        <Menu
          options={this.state.options}
          onToggle={open => this.setState({isMenuOpen: open})}
          onChange={options => this.setState({options})}
        />
        <TagsInput value={this.state.tags} onChange={this.handleChange} />
        <Account squeezed={this.state.isMenuOpen} options={this.state.options} />

        <Chain squeezed={this.state.isMenuOpen} options={this.state.options} />

        <style>{`
          .example-select--from
          .mdl-switch.is-checked
          .mdl-switch__thumb {
            background-color: ${this.state.options.fromColor}
          }

          .example-select--to
          .mdl-switch.is-checked
          .mdl-switch__thumb {
            background-color: ${this.state.options.toColor}
          }
        `}</style>
      </div>
    );
  }
}

export default App;
