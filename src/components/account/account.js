import React, {Component} from 'react'; // eslint-disable-line no-unused-vars
import './account.css';
import {loadAccount} from '../../api';
import {REFRESH_TIME, CHAIN_MARGIN_TOP, ETHERSCAN_BASE_URL} from '../../config';
import Transaction from '../transaction/transaction';
import Details from '../details/details';
import {isMobile} from '../../helper';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedTransactions: [],
      selectedBlockHash: null,
      selectedTxHash: null,
      selectedBlockTop: 0
    };
  }

  componentDidMount() {
    this.updateBlocks();
  }

  updateBlocks() {


    loadAccount('0xc30f370B4ca500eF0eF78a22F5aB8cD445760784')
      .then(transactions => {
        this.setState({sortedTransactions: transactions});
      })
      .catch(() => setTimeout(() => this.updateBlocks(), REFRESH_TIME));

  }

  // addBlocks(blocks) {
  //   const blockHashs = this.state.blocks.map(({hash}) => hash);
  //   const blocksToAdd = blocks.filter(({hash}) => !blockHashs.includes(hash));
  //   const newBlocks = this.state.blocks.concat(blocksToAdd);
  //   newBlocks.sort((a, b) => b.number - a.number);
  //   const topBlocks = newBlocks.slice(0, 100);
  //
  //   this.setState({blocks: topBlocks});
  // }

  setSelectedTransaction(hash) {
    if (isMobile() && hash === null) {
      return;
    }

    this.setState({selectedTxHash: hash});
  }

  setSelectedBlock(hash) {
    if (isMobile() && hash === null) {
      return;
    }

    if (hash === null) {
      this.setState({selectedBlockHash: null});
      return;
    }

    this.setState({
      selectedTxHash: hash
    });
  }

  getSelectedBlock(hash) {
    return this.state.blocks.find(block => block.hash === hash);
  }

  getSelectedTransaction(block, hash) {
    return block.transactions.find(tx => tx.hash === hash);
  }

  handleTransactionClick(hash) {
    if (isMobile()) {
      return;
    }
  }

  render() {
    const {
      blocks,
      selectedBlockTop,
      selectedBlockHash,
      selectedTxHash
    } = this.state;
    //
    // if (blocks.length === 0) {
    //   return <div className="chain-loading" />;
    // }
    //
    // const {squeezed, options} = this.props;
    // const selectedBlock =
    //   selectedBlockHash && this.getSelectedBlock(selectedBlockHash);
    // const selectedTransaction =
    //   selectedBlock &&
    //   selectedTxHash &&
    //   this.getSelectedTransaction(selectedBlock, selectedTxHash);
    const classes = [
      'block',
      // squeezed && 'chain--squeezed',
      // options.contractCalls && 'chain--contract-calls',
      // options.contractCreates && 'chain--contract-creates'
    ]
    //   .filter(Boolean)
    //   .join(' ');

    return (
      <div className={classes} >

        {this.state.sortedTransactions.map(tx => {
          if(this.state.selectedTxHash === tx.hash) {
            return <div><input type="text" value={tx.hash} /></div>
          } else {
            return <div><Transaction data={tx} key={tx.hash} onSelect={txHash => this.setSelectedTransaction(txHash)} /></div>
          }
        })}


      </div>
    );
  }
}

export default Account;
