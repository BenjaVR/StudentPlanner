import { ISchool } from "studentplanner-functions/shared/contract/ISchool";
import { Firebase } from "./FirebaseInitializer";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class SchoolsService extends FirestoreServiceBase<ISchool> {
    protected readonly collectionRef = Firebase.firestore().collection("schools");

    protected cleanBeforePersistToFirestore(model: ISchool): ISchool {
        return model;
    }
}
