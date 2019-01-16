import { IEducation } from "studentplanner-functions/src/contract/IEducation";
import { Firebase } from "../config/FirebaseInitializer";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class EducationsService extends FirestoreServiceBase<IEducation> {
    protected readonly collectionRef = Firebase.firestore().collection("educations");
}
