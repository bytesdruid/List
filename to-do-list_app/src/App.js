import logo from './logo.svg';
import './App.css';
import {PeraWalletConnect} from '@perawallet/connect';
import algosdk, { waitForConfirmation } from 'algosdk';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from '@material-ui/core/Button';

// instantiates pera wallet connection
const peraWallet = new PeraWalletConnect();

// app ID from the testnet deployment
const appIndex = 120823072;

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
        <div className='centered-div'>
          <Button variant="outlined" color="primary"
            onClick={isConnectedToPeraWallet ? handleDisconnectWalletClick : handleConnectionWalletClick
            }>
            {isConnectedToPeraWallet ? "Disconnect": "Connect to Pera Wallet"}
          </Button>
        </div>
        <div className='centered-div'>
          <Button variant='outlined' color="primary"
            onClick={
              () => optInToApp()
            }>
            Opt-in
          </Button>
        </div>
        <div className='centered-div'>
          <Button variant='outlined' color="primary"
            onClick={
              () => callSetToDoListItem('Set_Item_1', 'Title 1', 'Description 1')
            }>
            Set Item 1
          </Button>
          <Button variant='outlined' color="primary"
            onClick={
              () => callSetToDoListItem('Set_Item_2', 'Title 2', 'Description 2')
            }>
            Set Item 2
          </Button>
          <Button variant='outlined' color="primary"
            onClick={
              () => callSetToDoListItem('Set_Item_3', 'Title 3', 'Description 3')
            }>
            Set Item 3
          </Button>
        </div>
        <div className='centered-div'>
          <Button variant='outlined' color="primary"
            onClick={
              () => callCompleteToDoListItem('Mark_Complete_1')
            }>
            Mark Complete 1
          </Button>
          <Button variant='outlined' color="primary"
            onClick={
              () => callCompleteToDoListItem('Mark_Complete_2')
            }>
            Mark Complete 2
          </Button>
          <Button variant='outlined' color="primary"
            onClick={
              () => callCompleteToDoListItem('Mark_Complete_3')
            }>
            Mark Complete 3
          </Button>
        </div>
      </div>
    </Container>
  );

  // function for making noop calls to Algorand application
  async function callSetToDoListItem(appArg1, appArg2, appArg3) {
    try {
      // get suggester txn params from algod
      const suggestedParams = await algod.getTransactionParams().do();
      // app arg array
      const appArgs = [];
      // add the first argument to the app arg array
      appArgs.push([...(new Uint8Array(Buffer.from(appArg1)))]);
      console.log(appArgs);
      // add the first argument to the app arg array
      appArgs.push([...(new Uint8Array(Buffer.from(appArg2)))]);
      console.log(appArgs);
      // add the first argument to the app arg array
      appArgs.push([...(new Uint8Array(Buffer.from(appArg3)))]);
      console.log(appArgs);
      // this has all txn params
      const actionTx = algosdk.makeApplicationNoOpTxn(
          accountAddress,new
          suggestedParams,
          appIndex,
          appArgs
      );
      // has txn info and signer info
      const actionTxGroup = [{txn: actionTx, signers: [accountAddress]}];
      // execute the txn
      const signedTx = await peraWallet.signTransaction([actionTxGroup]);
      // print the txn results object
      console.log(signedTx)
      // get the txn id from algod
      const { txId } = await algod.sendRawTransaction(signedTx).do();
      const result = await waitForConfirmation(algod, txId, 2);
    } catch (e) {
      console.error(`There was an error setting item 1: ${e}`);
    }
  }

  // function for making noop calls to Algorand application
  async function callCompleteToDoListItem(appArg1) {
    try {
      // get suggester txn params from algod
      const suggestedParams = await algod.getTransactionParams().do();
      // set the application argument from the action being passed in
      const appArgs = [new Uint8Array(Buffer.from(appArg1))];
      // this has all txn params
      const actionTx = algosdk.makeApplicationNoOpTxn(
          accountAddress,
          suggestedParams,
          appIndex,
          appArgs
      );
      // has txn info and signer info
      const actionTxGroup = [{txn: actionTx, signers: [accountAddress]}];
      // execute the txn
      const signedTx = await peraWallet.signTransaction([actionTxGroup]);
      // print the txn results object
      console.log(signedTx)
      // get the txn id from algod
      const { txId } = await algod.sendRawTransaction(signedTx).do();
      const result = await waitForConfirmation(algod, txId, 2);
    } catch (e) {
      console.error(`There was an error setting item 1: ${e}`);
    }
  }

  // function that opts account into application
  async function optInToApp() {
    const suggestedParams = await algod.getTransactionParams().do();
    const optInTxn = algosdk.makeApplicationOptInTxn(
      accountAddress,
      suggestedParams,
      appIndex
    );

    const optInTxGroup = [{txn: optInTxn, signers: [accountAddress]}];

      const signedTx = await peraWallet.signTransaction([optInTxGroup]);
      console.log(signedTx);
      const { txId } = await algod.sendRawTransaction(signedTx).do();
      const result = await waitForConfirmation(algod, txId, 2);
  }

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
