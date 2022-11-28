import path from "path";
import express, { Express, NextFunction, Request, Response } from "express";
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts";

const app: Express = express();

//middleware to parse incoming request bodies
app.use(express.json());

//middleware to serve client code
app.use("/", express.static(path.join(__dirname, "../../client/dist")));

//middleware handling CORS
app.use(function (
  inRequest: Request,
  inResponse: Response,
  inNext: NextFunction
) {
  inResponse.header("Access-Control-Allow-Origin", "*");
  inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  inResponse.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  inNext();
});

app.get("/mailboxes", async (inRequest: Request, inResponse: Response) => {
  try {
    const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
    const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
    inResponse.json(mailboxes);
  } catch (inError) {
    console.log("ERROR imap server: ", inError);
    inResponse.send("error connecting to IMAP server");
  }
});

app.get(
  "/mailboxes/:mailbox",
  async (inRequest: Request, inResponse: Response) => {
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
      const messages: IMAP.IMessage[] = await imapWorker.listMessages({
        mailbox: inRequest.params.mailbox,
      });
      inResponse.json(messages);
    } catch (inError) {
      inResponse.send("error retreiving from IMAP server");
    }
  }
);

app.get(
  "/messages/:mailbox/:id",
  async (inRequest: Request, inResponse: Response) => {
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
      const messageBody: string = await imapWorker.getMessageBody({
        mailbox: inRequest.params.mailbox,
        id: parseInt(inRequest.params.id, 10),
      });
      inResponse.send(messageBody);
    } catch (inError) {
      inResponse.send("error");
    }
  }
);

//delete a message
app.delete(
  "/messages/:mailbox/:id",
  async (inRequest: Request, inResponse: Response) => {
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
      await imapWorker.deleteMessage({
        mailbox: inRequest.params.mailbox,
        id: parseInt(inRequest.params.id, 10),
      });
      inResponse.send("ok");
    } catch (inError) {
      console.log(inError);

      inResponse.send("error deleting the message");
    }
  }
);

//send a message
app.post("/messages", async (inRequest: Request, inResponse: Response) => {
  try {
    const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
    await smtpWorker.sendMessage(inRequest.body);
    inResponse.send("ok");
  } catch (inError) {
    inResponse.send("error");
  }
});

//get all contacts
app.get("/contacts", async (inRequest: Request, inResponse: Response) => {
  try {
    const contactsWorker: Contacts.Worker = new Contacts.Worker();
    const contacts: Contacts.IContact[] = await contactsWorker.listContacts();
    inResponse.json(contacts);
  } catch (inError) {
    inResponse.send("error");
  }
});

//add contact
app.post("/contacts", async (inRequest: Request, inResponse: Response) => {
  try {
    const contactsWorker: Contacts.Worker = new Contacts.Worker();
    const contact: Contacts.IContact = await contactsWorker.addContact(
      inRequest.body
    );
    inResponse.json(contact);
  } catch (inError) {
    inResponse.send("error");
  }
});

//delete a contact
app.delete(
  "/contacts/:id",
  async (inRequest: Request, inResponse: Response) => {
    try {
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      await contactsWorker.deleteContact(inRequest.params.id);
      inResponse.send("ok");
    } catch (inError) {
      inResponse.send("error");
    }
  }
);

app.listen(3000, () => {
  console.log("MailBag server open for requests");
});
