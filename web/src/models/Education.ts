import { IFirebaseTable } from "../services/FirestoreServiceBase";

export interface IEducation extends IFirebaseTable {
    name: string;
}
