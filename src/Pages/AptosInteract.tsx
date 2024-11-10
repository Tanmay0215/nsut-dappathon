// import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import { WalletButton } from "../Components/WalletButton";

// const NFTMinter = () => {
//   // const address = 0xfe7c2f5d4eac6747b2c3ecce0a3044ee1ddd12fc47b893f9f359690f288307c1;
//   const collectionName = "My Collection";
//   const collectionDescription = "My first NFT collection";
  
//   const APTOS_NETWORK: Network = Network.TESTNET;
//   const config = new AptosConfig({ network: APTOS_NETWORK });
//   const aptos = new Aptos(config);
  
//   const mintNFTTransaction = async () => {
//     const { address } = useWallet();
  
//     const createCollectionTransaction = await aptos.createCollectionTransaction(
//       {
//         creator: address,
//         description: collectionDescription,
//         name: collectionName,
//         uri: "QmYwXhcu3hoy6bxqDfGz85KBeK3CnhqUznQBWjMRf6Mvmu",
//       }
//     );
//     console.log("Create collection transaction:", createCollectionTransaction);
//     // createCollectionTransaction();

//     const committedTxn = await aptos.signAndSubmitTransaction({
//       signer: address,
//       transaction: createCollectionTransaction,
//     });

//     console.log("Committed transaction:", committedTxn);
//   };

//   mintNFTTransaction();
//   return (
//     <div>
//       <h1>Collection created!</h1>
//       {/* <button>Click me</button> */}
//       <WalletButton/>
//       <p>
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
//         tempore doloribus vero corrupti cupiditate porro quia totam, repudiandae
//         placeat animi. Dolores explicabo voluptates vel necessitatibus
//         architecto consequuntur non voluptatum modi.
//       </p>
//     </div>
//   );
// };

// export default NFTMinter;
