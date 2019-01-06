import { Firebase } from "../config/FirebaseInitializer";
import { IEducation } from "../models/Education";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class EducationsService extends FirestoreServiceBase<IEducation> {
    protected readonly collectionRef = Firebase.firestore().collection("educations");
}
