import React, { useState, useEffect } from "react";
import { AptosClient, TokenClient } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

const NFTMinter = () => {
  const [address] = useWallet();
  const [wallet, setWallet] = useState(null);
  const [client, setClient] = useState(null);
  const [tokenClient, setTokenClient] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collectionUri, setCollectionUri] = useState("");
  const [maxSupply, setMaxSupply] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [tokensMinted, setTokensMinted] = useState(0);
  const [status, setStatus] = useState("");

  const MODULE_ADDRESS =
    "0x429a2ea89ca2833eced9a721a5c8b5a9575a5a5af5d30f93eb06a9275353aa0b"; // Replace with your deployed module address
  const NODE_URL = "https://fullnode.testnet.aptoslabs.com";

  const mintNFT = async () => {
    try {
      if (!wallet) throw new Error("Please connect wallet first");
      if (!receiverAddress) throw new Error("Please enter receiver address");

      const payload = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::simple_nft::mint_nft`,
        type_arguments: [],
        arguments: [
          receiverAddress,
          collectionName,
          collectionDescription,
          collectionUri,
        ],
      };

      const response = await window.aptos.signAndSubmitTransaction(payload);
      await client.waitForTransaction(response.hash);
      console.log(response);

      // const mintedCount = await getTokenData();
      // setTokensMinted(mintedCount);
      // setStatus('NFT minted successfully!');
    } catch (error) {
      setStatus(`Failed to mint NFT: ${error.message}`);
    }
  };

  // const getTokenData = async () => {
  //   try {
  // const client = new AptosClient(NODE_URL);
  // const tokenClient = new TokenClient(client);
  //     const resource = await client.view({
  //       function: `${MODULE_ADDRESS}::simple_nft::get_token_data`,
  //       type_arguments: [],
  //       arguments: [wallet]
  //     });
  //     return parseInt(resource[0]);
  //   } catch (error) {
  //     console.error('Failed to get minted count:', error);
  //     return 0;
  //   }
  // };

  return (
    <>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <WalletSelector />

        <div style={{ marginTop: "20px" }}>
          <h2>Initialize Collection</h2>
          <input
            type="text"
            placeholder="Collection Name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Collection Description"
            value={collectionDescription}
            onChange={(e) => setCollectionDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Collection URI"
            value={collectionUri}
            onChange={(e) => setCollectionUri(e.target.value)}
          />
          <input
            type="text"
            placeholder="Receiver Address"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
          />
          <button onClick={mintNFT}>Mint NFT</button>
        </div>
      </div>
    </>
  );
};

export default NFTMinter;
