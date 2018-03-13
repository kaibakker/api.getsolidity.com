# Etherview


This project aims to server an documentation and specification page for contracts on the Ethereum blockchain,

## Server

The project includes a tiny node.js express server which loads and caches the last x blocks and collects all ABI data it can find and stores them in mongodb. Contracts have multiple interfaces according to unfinalized [ERC-165](https://github.com/ethereum/EIPs/pull/881). To avoid calling the [etherscan.io](https://etherscan.io) API to often the server stops pulling blocks when there are no new incoming client requests.

## Develop

with local server:

install mongodb

```
npm i
API_KEY=XYZ node server/server.js
npm start
```


## API


- GET /blocks returns blocks with transaction data

- GET /accounts/:address returns all transaction data for a specific address, same format as /blocks

- GET /contracts/:address returns all contract data for a specific address, formatted according to the [truffle contract schema](missing) + an x-interfaces array which describes interfaces and their documentation starting with the most prioritied.

- GET /contracts returns all contracts addresses available for the database

## Contribute

Ideas, PRs & Feedback welcome!

## Thanks

Thanks to [etherscan.io](https://etherscan.io) for their free API usage and to [zeit](https://zeit.co/now) for their awesome `now` deployments!
