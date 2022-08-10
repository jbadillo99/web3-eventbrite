import { Address, ipfs, json } from "@graphprotocol/graph-ts"
import {
  ConfirmedAttendee,
  DepositsPaidOut,
  NewEventCreated,
  NewRSVP
} from "../generated/Web3EventBrite/Web3EventBrite"
import { Account, RSVP, Confirmation, Event } from "../generated/schema"
import { integer } from "@protofire/subgraph-toolkit"

export function handleConfirmedAttendee(event: ConfirmedAttendee): void {

  // Set the id as the eventID and attendee address
  let id = event.params.eventID.toHex() + event.params.attendeeAddress.toHex();
  
  // Load the id for the confirmation
  let newConfirmation = Confirmation.load(id);

  // Create or get account based on attendee address
  let account = getOrCreateAccount(event.params.attendeeAddress);

  // The event is loaded using the eventID hash
  let thisEvent = Event.load(event.params.eventID.toHex());

  // If there is not a confirmation from this person and the event exists
  if (newConfirmation == null && thisEvent != null) {

    // Create a new confirmation
    newConfirmation = new Confirmation(id);
    newConfirmation.attendee = account.id;
    newConfirmation.event = thisEvent.id;
    newConfirmation.save();

    // Increase the total confirmed attendees
    thisEvent.totalConfirmedAttendees = integer.increment(thisEvent.totalConfirmedAttendees);
    thisEvent.save();

    // Increase the total attended events
    account.totalAttendedEvents = integer.increment(account.totalAttendedEvents);
    account.save();
  }

}

export function handleDepositsPaidOut(event: DepositsPaidOut): void {
  
  // Load the Event entity to get the eventID as a hex value
  let thisEvent = Event.load(event.params.eventID.toHex());

  // If event exists then set paidOut to true
  if(thisEvent) {
    thisEvent.paidOut = true;
    thisEvent.save();
  }
}

export function handleNewEventCreated(event: NewEventCreated): void {

  // Load the Event entity to get the eventID as a hex value
  let newEvent = Event.load(event.params.eventID.toHex());

  // If the event is not found then we can create a new one and save it
  if (newEvent == null) {
    newEvent = new Event(event.params.eventID.toHex());

    // Set the event parameters using the event object
    newEvent.eventID = event.params.eventID;
    newEvent.eventOwner = event.params.creatorAddress;
    newEvent.eventTimestamp = event.params.eventTimestamp;
    newEvent.maxCapacity = event.params.maxCapacity;
    newEvent.deposit = event.params.deposit;
    newEvent.paidOut = false;

    // Set the total confirmed attendees and the number of RSVPs to zero
    newEvent.totalRSVPs = integer.ZERO;
    newEvent.totalConfirmedAttendees = integer.ZERO;

    let metadata = ipfs.cat(event.params.eventDataCID + "./data.json");

    if(metadata){
        const value = json.fromBytes(metadata).toObject();
        if (value) {
          // Use the eventDataCID to get the name, description, link, and image of the file
          const name = value.get("name");
          const description = value.get("description");
          const link = value.get("link");
          const imagePath = value.get("image");


        if (link) {
          newEvent.link = link.toString();
        }

        if (name) {
          newEvent.name = name.toString();
        }

        if (description) {
          newEvent.description = description.toString();
        }
        
        if (imagePath) {
          const imageURL = "https://ipfs.io/ipfs/" + event.params.eventDataCID + imagePath.toString();
          newEvent.imageURL = imageURL;
        } else {
          // This is the fallback URL if there is no image path that exists
          const imageURL = "https://ipfs.io/ipfs/bafybeibssbrlptcefbqfh4vpw2wlmqfj2kgxt3nil4yujxbmdznau3t5wi/event.png";
          newEvent.imageURL = imageURL;
        }
      }
    }
    newEvent.save();
  }
}

// Load an account using address or create an account using an address if not already present
function getOrCreateAccount(address: Address): Account {
  let account = Account.load(address.toHex());
  if( account == null) {
    account = new Account(address.toHex());
    account.totalRSVPs = integer.ZERO;
    account.totalAttendedEvents = integer.ZERO;
    account.save();
  }
  return account;
}

export function handleNewRSVP(event: NewRSVP): void {
  let newRSVP = RSVP.load(event.transaction.from.toHex());
  let account = getOrCreateAccount(event.params.attendeeAddress);
  let thisEvent = Event.load(event.params.eventID.toHex());
  if (newRSVP == null && thisEvent != null) {
    // Create new RSVP object using the transaction hash
    newRSVP = new RSVP(event.transaction.from.toHex());

    // Assign the attendee address and the the event id using the account id
    newRSVP.attendee = account.id;
    newRSVP.event = thisEvent.id;
    newRSVP.save();

    // Increase the total RSVPs of the account using the protofire integer
    account.totalRSVPs = integer.increment(account.totalRSVPs);
    account.save();

  }

}
