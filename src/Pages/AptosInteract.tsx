import {
  Account,
  Aptos,
  AptosConfig,
  Network,
} from "@aptos-labs/ts-sdk";
import { WalletButton } from "../Components/WalletButton";
import { AptosAccount, AptosClient, TokenClient } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const NFTMinter = () => {

  const collectionName = "My_Collection";
  const collectionDescription = "My first NFT collection";
  const uri = "QmYwXhcu3hoy6bxqDfGz85KBeK3CnhqUznQBWjMRf6Mvmu";

  const alice = Account.generate();
  const userAccount = new AptosAccount(alice.privateKey['signingKey']['data'])
  console.log(alice)
  const createAccount = async () => {
    const res = await aptos.fundAccount({
      accountAddress: alice['accountAddress'],
      amount: 1000_000_000,
    });
    console.log(res)
  };

  const APTOS_NETWORK: Network = Network.TESTNET;
  const config = new AptosConfig({ network: APTOS_NETWORK });
  const aptos = new Aptos(config);
  const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
  const aptosclient = new AptosClient(NODE_URL)
  const tokenClient = new TokenClient(aptosclient)
  const {account} = useWallet();
  const collectionTransaction = async () => {
    await createAccount();
    console.log("Creating collection transaction...");
    // console.log(account.address);
    
    const createCollectionTransaction = await aptos.createCollectionTransaction(
      {
        creator: alice,
        description: collectionDescription,
        name: collectionName,
        uri: uri,
      }
    );
    console.log("Create collection transaction:", createCollectionTransaction);

    console.log("Create collection transaction:", createCollectionTransaction);
    // createCollectionTransaction();

    const committedTxn = await aptos.signAndSubmitTransaction({
      signer: alice,
      transaction: createCollectionTransaction,
    });

    console.log("Committed transaction:", committedTxn);
  };
  async function mintNFT() {
    console.log(uri)
    console.log("hello this is my kingdom")
    console.log(new AptosAccount(alice.privateKey['signingKey']['data']),)
    const txnHash = await tokenClient.createToken(
      userAccount,
      collectionName,
      "My NFT", // Name of the NFT
      collectionName,
      1,
      uri,
      0
    );
    await aptosclient.waitForTransaction(txnHash);
    console.log(`NFT minted with hash: ${txnHash}`);
  }
  
  async function transferNFT() {
    console.log(account)
    try {
      const txnHash = await tokenClient.offerToken(
        userAccount,                 
        account['address'], 
        userAccount,
        collectionName,           
        "My NFT",              
        1                   
      );
      // Wait for transaction confirmation
      await aptosclient.waitForTransaction(txnHash);
      console.log(`NFT transferred successfully with transaction hash: ${txnHash}`);
    } catch (error) {
      console.error("Error transferring NFT:", error);
    }
  }
  
  return (
    <div>
      <h1>Collection created!</h1>
      {/* <button>Click me</button> */}
      <WalletButton />
      <button type="submit" onClick={collectionTransaction} className="border p-4 rounded ">
        Create Collection
      </button>
      <button type="submit" onClick={mintNFT}>
        Generate NFT
      </button>
      <button type="submit" onClick={transferNFT}>
        Transfer NFT
      </button>
    </div>
  );
};

export default NFTMinter;
