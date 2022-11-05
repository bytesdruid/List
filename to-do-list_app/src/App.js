import logo from './logo.svg';
import './App.css';
import {PeraWalletConnect} from '@perawallet/connect';
import algosdk from 'algosdk';

// instantiates pera wallet connection
const peraWallet = new PeraWalletConnect();

// app ID from the testnet deployment
const appIndex = 120454587;

// algorand node connection instantiated
const algod = new algosdk.Algodv2('','https://testnet-api.algonode.cloud', 443);

function App() {
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

export default App;
