import { Firebase } from "../config/FirebaseInitializer";
import { IStudent } from "../models/Student";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class StudentsService extends FirestoreServiceBase<IStudent> {
    protected readonly collectionRef = Firebase.firestore().collection("students");
}
