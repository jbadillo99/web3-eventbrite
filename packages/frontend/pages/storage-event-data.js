import {Web3Storage, File, getFilesfromPath} from "web3.storage";
const { resolve } = require("path");

// Handle the incoming requests 
// Check if the request is a POST and store the data if it is, or send status code 405 if not
export default async function handler(req, res) {
    if (req.method == "POST") {
        return await storeEventData(req,res);
    } else {
        return res
            // HTTP Response 405: Method Not Allowed
            .status(405)
            .json({message:"Method Not allowed", success: false});
    }
}

// Get the body of the request to get the cid that points to the IPFS directory of stored file
async function storeEventData(req,res){
    const body = req.body;

    try {
        // Get the current file from IPFS
        const files = await makeFileObjects(body);

        // Get the content ID (CID) using the current file
        const cid = await storeFiles(files);
        return res
            // HTTP Response 200: success
            .status(200)
            .json({success: true, cid: cid})
    } catch(error) {
        return res
            // HTTP Response 500: Error Creating Event
            .status(500)
            .json({error: "Error Creating Event", success: false});
    }
}

async function makeFileObjects(body) {

    // Make a buffer using a string of the body
    const buffer = Buffer.from(JSON.stringify(body));

    // Get the path to image and get the files from IPFS
    const imageDir = resolve(process.cwd(), `public/images/${body.image}`);
    const files = getFilesfromPath(imageDir);

    files.push(new File([buffer],"data.json"));
    return files;
}

// Make a Web3Storage client using the private key
async function makeStorageClient() {
    return new Web3Storage({token: process.env.WEB3STORAGE_TOKEN});
}

// Make a client and put the files to upload
// Return the CID to store on-chain
async function storeFiles(files) {
    const client = makeStorageClient();
    const cid = await client.put(files);
    return cid;
}