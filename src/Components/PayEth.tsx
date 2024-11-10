import axios from "axios";
import { useEffect, useState } from 'react';
import Web3 from 'web3';


const PayEth = ({tickets, event}) => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [events, setEvents] = useState([]);
  const totalMoney = tickets * event['Price'];
    
    const user = {
        Name: "Dev",
        Email: "dev@gmail.com",
        ContactNo: 123123122,
    }

    const buyTicket = async (eventId, price) => {
      try {
        const tx = await contract.methods.buyTicket(eventId).send({
          from: account,
          value: Web3.utils.toWei(price, 'ether')
        });
        console.log('Ticket purchased:', tx);
      } catch (error) {
        console.error('Error buying ticket:', error);
      }
    };


    const [loading, setLoading] = useState(false);
    const [eventName, setEventName] = useState(event["EventName"]);
    const [eventDescription, setEventDescription] = useState(event["Description"]);
    const [ipfsUrl, setIpfsUrl] = useState([]);
    const [eventDate, setEventDate] = useState(event["Date"]);
    const [eventArtist, setEventArtist] = useState(event["Artist"]);
    const [eventVenue, setEventVenue] = useState(event["Venue"]);
    const [owner, setOwner] = useState(user.Name);
    const [accountAddress, setAccountAddress] = useState(account)

    const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
    const pinataApiSecret = import.meta.env.VITE_PINATA_SECRET;

    console.log(pinataApiKey, pinataApiSecret)

    const uploadMetadataToIPFS = async (metadata) => {
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    
        try {
          const response = await axios.post(url, metadata, {
            headers: {
              'pinata_api_key': pinataApiKey,
              'pinata_secret_api_key': pinataApiSecret,
            },
          });

          return response.data.IpfsHash;


        } catch (error) {
          console.error('Error uploading metadata to IPFS: ', error.message);
          throw error;
        }
      };
      useEffect(() => {
        const init = async () => {
          if (window.ethereum) {
            try {
              // Request account access
              await window.ethereum.request({ method: 'eth_requestAccounts' });
    
              // Initialize Web3
              const newWeb3 = new Web3(window.ethereum);
              setWeb3(newWeb3);
    
              // Get the connected accounts
              const accounts = await newWeb3.eth.getAccounts();
              setAccount(accounts[0]);
    
              // Initialize the contract
              newContract = new newWeb3.eth.Contract(EventTicketNFTABI, contractAddress);
    
            } catch (error) {
              console.error("User denied account access or other error:", error);
            }
          } else {
            alert("Please install MetaMask!");
          }
        };
    
        init();
      }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        for(let i=0; i<tickets; i++){

          try {
          const metadata = {
              eventName: eventName,
              eventDescription: eventDescription,
              eventDate: eventDate,
              eventArtist: eventArtist,
              eventVenue: eventVenue,
              owner: owner,
              ticketNo: event['TotalTickets'],
              image: event["PreviewToken"]
          };
  
          event.TotalTickets--;
  
  
          const metadataIpfsHash = await uploadMetadataToIPFS(metadata);
          console.log('Metadata uploaded to IPFS ticket ',i," :", metadataIpfsHash);
  
  
          setIpfsUrl(prev => (
            [
              ...prev,
              `ipfs://${metadataIpfsHash}`
            ]
          ));

          // setLoading(false);
          // setLoading(false);

          } catch (error) {
          console.error('Error in NFT upload:', error);
        }
        finally{
          buyTicket(event['id'], event['Price']);
          setLoading(false);
        }
        }

        }
  };

    return ( 
        <button className="py-1 px-4 rounded-lg bg-green-500 text-[24px] text-black font-semibold justify-self-end" onClick={()=>buyTicket(event.id, event.Price)}>Pay {(totalMoney).toFixed(2)} ETH</button>
        
    );
 
export default PayEth;

