import { IFirebaseModel } from "../services/FirestoreServiceBase";

export interface ISchool extends IFirebaseModel {
    name: string;
}
