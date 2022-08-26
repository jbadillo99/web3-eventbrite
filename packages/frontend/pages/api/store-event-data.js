import { Web3Storage, File, getFilesFromPath } from "web3.storage";
const { resolve } = require("path");

// Check if the incoming request is a post method or return a HTTP 405 status code
export default async function handler(req, res) {
    if (req.method === "POST") {
        // Store the data from the event using request
        return await storeEventData(req, res);
    } else {
        // HTTP Status Code 405: Method not allowed
        return res
            .status(405)
            .json({ message: "Method not allowed", success: false });
    }
}

// Store the event data using the request of the handler
async function storeEventData(req, res) {
    const body = req.body;
    try {
        // Get files from the body of the request
        const files = await makeFileObjects(body);

        // Get the CID from the stored file from IPFS
        const cid = await storeFiles(files);

        // HTTP Status Code 200: OK
        return res
            .status(200)
            .json( { success: true, cid: cid});
    } catch(error) {
        // HTTP Status Code 500: Internal Server Error
        return res
            .status(500)
            .json( {error: "Error creating event", success: false});
    }
}

async function makeFileObjects(body) {

    // Handle raw binary from body of request
    const buffer = Buffer.from(JSON.stringify(body));

    // Get the image directory from the current path
    const imageDirectory = resolve(process.cwd(), `public/images/${ body.image }`);

    // Get the image files from folder
    const files = await getFilesFromPath(imageDirectory);

    // Create a new file containing image and the event data
    files.push(new File([buffer], "data.json"));
    console.log('In Files: ', files);

    return files;
}

async function storeFiles(files) {

    // Make a storage client
    const client = makeStorageClient();

    // Add files and return the content identifier (CID)
    const cid = await client.put(files);

    return cid;
}

function makeStorageClient() {
    return new Web3Storage( { token: process.env.WEB3STORAGE_TOKEN});
}

