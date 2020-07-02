import React, { Component } from "react";
import CreateCartContract from "./contracts/createCart.json";
import getWeb3 from "./getWeb3";
import Navbar from './Navbar'
import Products from './Products';


// import "./App.css";

class App extends Component {
  state = { loaded: false };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.deployedNetwork = CreateCartContract.networks[this.networkId];
      this.CreateCart = new this.web3.eth.Contract(
        CreateCartContract.abi,
        this.deployedNetwork && this.deployedNetwork.address,
      );
      
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded:true }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  createProduct = async(name,price) => {

    const result = await this.CreateCart.methods.createProduct(name,price).send({from: this.accounts[0]});
    console.log(result)
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Navbar account={this.accounts[0]}/><br/>
        <div>
          <Products createProduct={this.createProduct} web3={this.web3}/>
       
        </div>
      </div>
    );
  }
}

export default App;
