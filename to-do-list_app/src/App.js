import logo from './logo.svg';
import './App.css';
import {PeraWalletConnect} from '@perawallet/connect';
import algosdk from 'algosdk';
import { useEffect } from 'react';

// instantiates pera wallet connection
const peraWallet = new PeraWalletConnect();

// app ID from the testnet deployment
const appIndex = 120454587;

// algorand node connection instantiated
const algod = new algosdk.Algodv2('','https://testnet-api.algonode.cloud', 443);

function App() {
  // when component is mounted reconnect pera wallet session

  useEffect(() => {
    peraWallet.reconnectSession().then((accounts) => {
      // disconnection event listener
      peraWallet.connector?.on('disconnect', handleDisconnectWalletClick);
  
      if (accounts.length) {
        setAccountAddress(accounts[0]);
      }
    })

  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// function that handles the wallet UI click to disconnect
function handleDisconnectWalletClick() {
  // disconnects the wallet
  peraWallet.disconnect();
  // sets the account address to null value
  setAccountAddress(null);
}

export default App;
