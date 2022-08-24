import abiJSON from "./Web3EventBrite.json";
import { ethers } from "ethers";


// Try to access global ethereum API and return the rsvpContract with the correct contract configurations
function connectContract() {
    const contractAddress = "0x7C21e525258a5D4F8e9abE60F4CbA07B2168ee9d";
    const contractABI = abiJSON.abi;

    let rsvpContract;

    try {

        // Access ethereum API using the window object
        const { ethereum } = window;

        if (ethereum) {

            // Check for Eth object in window
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            rsvpContract = new ethers.Contract(contractAddress, contractABI, signer);
        } else {
            console.log("Ethereum object doesn't exist");
        }

    } catch(err) {
        console.log("ERROR: ", err);
    }
    return rsvpContract;
}
export default connectContract;