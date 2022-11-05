import logo from './logo.svg';
import './App.css';
import {PeraWalletConnect} from '@perawallet/connect';
import algosdk from 'algosdk';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from '@material-ui/core/Button';

// instantiates pera wallet connection
const peraWallet = new PeraWalletConnect();

// app ID from the testnet deployment
const appIndex = 120454587;

// algorand node connection instantiated
const algod = new algosdk.Algodv2('','https://testnet-api.algonode.cloud', 443);

function App() {
  // state for account address
  const [accountAddress, setAccountAddress] = useState(null);
  // state of connection to pera wallet
  const isConnectedToPeraWallet = !!accountAddress;

  // hooks are defined here
  useEffect(() => {
    // when component is mounted reconnect pera wallet session
    peraWallet.reconnectSession().then((accounts) => {
      // disconnection event listener
      peraWallet.connector?.on('disconnect', handleDisconnectWalletClick);
  
      if (accounts.length) {
        setAccountAddress(accounts[0]);
      }
    })

  },[]);

  return (
    <Container>
      <h1 className='top-div'>Critical Task List</h1>
      <div>
        <div className='centered-div'><Button variant="outlined" color="primary"
          onClick={isConnectedToPeraWallet ? handleDisconnectWalletClick : handleConnectionWalletClick
          }>
          {isConnectedToPeraWallet ? "Disconnect": "Connect to Pera Wallet"}
        </Button></div>
      </div>
      <div>
        <div className='centered-div'><Button variant="outlined" color="primary"
            onClick={isConnectedToPeraWallet ? handleDisconnectWalletClick : handleConnectionWalletClick
            }>
            {isConnectedToPeraWallet ? "Disconnect": "Connect to Pera Wallet"}
          </Button></div>
      </div>
    </Container>
  );

  // function that handles the connection to pera wallet through the UI
  function handleConnectionWalletClick() {
    // connects the wallet
    peraWallet.connect().then((newAccounts) => {
      // sets up disconnect event listener
      peraWallet.connector?.on('disconnect', handleDisconnectWalletClick);
      // sets the account address to a new account at index zero
      setAccountAddress(newAccounts[0]);
    });
  }

  // function that handles the wallet UI click to disconnect
  function handleDisconnectWalletClick() {
    // disconnects the wallet
    peraWallet.disconnect();
    // sets the account address to null value
    setAccountAddress(null);
  }

}

export default App;
