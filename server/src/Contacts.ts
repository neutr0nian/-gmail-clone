import Nedb from "nedb";
import * as path from "path";
const Datastore = require("nedb");

export interface IContact {
  _id?: number;
  name: string;
  email: string;
}

export class Worker {
  private db: Nedb;

  constructor() {
    this.db = new Datastore({
      fileName: path.join(__dirname, "contacts.db"),
      autoload: true,
    });
  }

  public listContacts(): Promise<IContact[]> {
    return new Promise((inResolve, inReject) => {
      this.db.find({}, (inError: Error | null, inDocs: IContact[]) => {
        if (inError) {
          inReject(inError);
        } else {
          inResolve(inDocs);
        }
      });
    });
  }

  public addContact(inContact: IContact): Promise<IContact> {
    return new Promise((inResolve, inReject) => {
      this.db.insert(inContact, (inError: Error | null, inNewDoc: IContact) => {
        if (inError) {
          inReject(inError);
        } else {
          inResolve(inNewDoc);
        }
      });
    });
  }

  public deleteContact(inID: string): Promise<string> {
    return new Promise((inResolve, inReject) => {
      this.db.remove(
        { _id: inID },
        {},
        (inError: Error | null, inNumRemove: number) => {
          if (inError) {
            inReject(inError);
          } else {
            inResolve("resolved");
          }
        }
      );
    });
  }
}
