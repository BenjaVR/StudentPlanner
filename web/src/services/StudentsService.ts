import { IStudent } from "studentplanner-functions/shared/contract/IStudent";
import { Firebase } from "../config/FirebaseInitializer";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class StudentsService extends FirestoreServiceBase<IStudent> {
    protected readonly collectionRef = Firebase.firestore().collection("students");
}
