import { Firebase } from "../config/FirebaseInitializer";
import { IDepartment } from "../models/Department";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class DepartmentsService extends FirestoreServiceBase<IDepartment> {
    protected readonly collectionRef = Firebase.firestore().collection("departments");
}
