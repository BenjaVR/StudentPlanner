import { IFirebaseTable } from "../services/FirestoreServiceBase";

export interface ISchool extends IFirebaseTable {
    name: string;
}
