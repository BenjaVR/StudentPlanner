import { Firebase } from "../config/FirebaseInitializer";
import { ISchool } from "../models/School";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class SchoolsService extends FirestoreServiceBase<ISchool> {
    protected readonly collectionRef = Firebase.firestore().collection("schools");
}
