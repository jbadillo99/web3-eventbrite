import abiJSON from "./Web3EventBrite.json";
import { ethers } from "ethers";


// Try to access global ethereum API and return the rsvpContract with the correct contract configurations
function connectContract() {
    const contractAddress = "0x7785e0a34C04c1c87269FF8469a68e0EE2867a93";
    const contractABI = abiJSON.abi;

    let rsvpContract;

    try {
        const {ethereum} = window;

        if(ethereum) {

            // Check for Eth object in window
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();

            rsvpContract = new ethers.Contract(contractAddress, contractABI, signer);
        } else {
            console.log("Ethereum object does'nt exist");
        }

    } catch(err) {
        console.log("ERROR: ", err);
    }
    return rsvpContract;
}
export default connectContract();