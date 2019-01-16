import { ISchool } from "studentplanner-functions/src/contract/ISchool";
import { Firebase } from "../config/FirebaseInitializer";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class SchoolsService extends FirestoreServiceBase<ISchool> {
    protected readonly collectionRef = Firebase.firestore().collection("schools");
}
