import { IDepartment } from "studentplanner-functions/shared/contract/IDepartment";
import { Firebase } from "../config/FirebaseInitializer";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class DepartmentsService extends FirestoreServiceBase<IDepartment> {
    protected readonly collectionRef = Firebase.firestore().collection("departments");
}
