import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient, Network } from "aptos";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";

function Temp({ event, tickets, userName }) {
  const {account , signAndSubmitTransaction} = useWallet();
  const accountAddress = account?.address;
  const { ipfsArray, setIpfsArray } = useContext(AppContext);
  const navigate = useNavigate();
  const IpfsUrlArray = [];
  const [isMining, setIsMining] = useState(false);
  const [status, setStatus] = useState("");
  const [tokensMinted, setTokensMinted] = useState(0);
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const client = new Aptos(aptosConfig);

  const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
  const pinataApiSecret = import.meta.env.VITE_PINATA_SECRET;
  const MODULE_ADDRESS =
    "0x429a2ea89ca2833eced9a721a5c8b5a9575a5a5af5d30f93eb06a9275353aa0b";

  const deployToIpfs = async () => {
    setIpfsArray([]);

    for (let i = 0; i < tickets; i++) {
      const metadata = {
        eventName: event["EventName"],
        eventDescription: event["Description"],
        eventDate: event["Date"],
        eventArtist: event["Artist"],
        eventVenue: event["Venue"],
        owner: userName,
        ticketNumber: event["TotalTickets"],
        NFTimage: event["NFTimg"],
      };
      try {
        event.TotalTickets--;

        const metadataIpfsHash = await uploadMetadataToIPFS(metadata);
        console.log(
          "Metadata uploaded to IPFS ticket ",
          i,
          " :",
          `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`
        );
        IpfsUrlArray.push(
          `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`
        );
      } catch (error) {
        console.log(`error while uploading to IPFS ${error}`);
        throw error;
      }
      IpfsUrlArray.length !== 0
        ? setIpfsArray(IpfsUrlArray)
        : setIpfsArray("no Ipfs Url");
    }
  };

  const uploadMetadataToIPFS = async (metadata) => {
    const url = import.meta.env.VITE_PINATA_URL;

    try {
      const response = await axios.post(url, metadata, {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataApiSecret,
        },
      });
      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading metadata to IPFS: ", error.message);
      throw error;
    }
  };

  const buyTicket = async () => {
    try {
      const payload: InputTransactionData = {
        data : {
          function: `${MODULE_ADDRESS}::payment_receiver::receive_payment`,
          // typeArguments: ["0x1::aptos_coin::AptosCoin"],
          functionArguments: [20000000]
          
        }
      };
      const response = await signAndSubmitTransaction(payload);
      // console.log("NFT minted successfully!");
      navigateToPaymentPage(true);
      // console.log("success")
    } catch (error) {
      setStatus(`Failed to mint NFT: ${error.message}`);
      // navigateToPaymentPage(false);/
      console.log("failed")
    }
  };

  const navigateToPaymentPage = (successfullTransaction) => {
    console.log(successfullTransaction)
    if (successfullTransaction) {
      navigate(`/Payment/${event.id}${1}`);
    } else {
      navigate(`/Payment/${event.id}${0}`);
    }
  };

  async function updateUserNftAndRewardToken(successfullTransaction) {
    try {
      const user = auth.currentUser;
      console.log(user);
      if (!user) {
        console.error("No user is currently logged in");
        navigate("/login");
        return;
      }

      const userId = user.uid;
      console.log(userId);
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      console.log(userDoc);

      if (!userDoc.exists()) {
        console.error("No such user document!");
        return;
      }

      const currentNftArray = userDoc.data().nft || [];
      const currentRewardTokens = userDoc.data().rewardTokens || 0;

      let updatedNftArray = [...currentNftArray];

      for (let i = 0; i < IpfsUrlArray.length; i++) {
        const newNftData = {
          ipfsUrl: IpfsUrlArray[i],
          eventId: event.id,
          address: accountAddress,
        };
        console.log(newNftData);
        console.log(event.Price);

        updatedNftArray.push(newNftData);
      }

      await updateDoc(userDocRef, {
        nft: updatedNftArray,
        rewardTokens:
          currentRewardTokens + IpfsUrlArray.length * event.Price * 1000,
      });

      console.log("User details updated successfully");
    } catch (error) {
      console.error("Error updating user details:", error);
    } finally {
      navigateToPaymentPage(successfullTransaction);
    }
  }

  const buyTicketHandeler = async (eventId, price) => {
    if (!accountAddress) {
      alert(
        "no wallet detected, connect to a wallet using the Connect Wallet button"
      );
      return;
    }
    await deployToIpfs();
    const successfullTransaction = await buyTicket();
    // const successfullTransaction = true;
    // if (successfullTransaction) {
    //   console.log(IpfsUrlArray);
    //   return updateUserNftAndRewardToken(successfullTransaction);
    // } else {
    //   return navigateToPaymentPage(successfullTransaction);
    // }
  };

  return (
    <button
      className="py-1 px-4 rounded-lg bg-green-500 text-[24px] text-black font-semibold justify-self-end"
      onClick={() => buyTicketHandeler(event.id, event.Price * tickets)}
    >
      Buy Ticket
    </button>
  );
}

export default Temp;
