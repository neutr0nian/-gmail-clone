import axios, { AxiosResponse } from "axios";
import { config } from "./config";

export interface IContact {
  _id?: number;
  name: string;
  email: string;
}

export class Worker {
  //returns a list of all contacts from the server
  public async listContacts(): Promise<IContact[]> {
    const response: AxiosResponse = await axios.get(
      `${config.serverAddress}/contacts`
    );
    return response.data;
  }

  //add a contact to the server
  public async addContact(contact: IContact): Promise<IContact> {
    const response: AxiosResponse = await axios.post(
      `${config.serverAddress}/contacts`,
      contact
    );
    return response.data;
  }

  //delete a contact from the server
  public async deleteContact(id: number): Promise<void> {
    await axios.delete(`${config.serverAddress}/contacts/${id}`);
  }
}
