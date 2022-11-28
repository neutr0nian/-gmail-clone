import axios, { AxiosResponse } from "axios";
import { config } from "./config";

export interface IMailbox {
  name: string;
  path: string;
}

export interface IMessage {
  id: string;
  date: string;
  from: string;
  subject: string;
  body?: string;
}

export class Worker {
  //returns an array of objects from mailbox
  public async listMailboxes(): Promise<IMailbox[]> {
    const response: AxiosResponse = await axios.get(
      `${config.serverAddress}/mailboxes`
    );
    return response.data;
  }

  //returns a list of messages in a named mailbox
  public async listMessages(inMailbox: string): Promise<IMessage[]> {
    const response: AxiosResponse = await axios.get(
      `${config.serverAddress}/mailboxes/${inMailbox}`
    );
    return response.data;
  }

  //returns the body of a specified message
  public async getMessageBody(
    inID: string,
    inMailbox: string
  ): Promise<string> {
    const response: AxiosResponse = await axios.get(
      `${config.serverAddress}/messages/${inMailbox}/${inID}`
    );
    return response.data;
  }

  //returns void but deletes the message
  public async deleteMessage(inID: string, inMailbox: string): Promise<void> {
    await axios.delete(`${config.serverAddress}/messages/${inMailbox}/${inID}`);
  }
}
