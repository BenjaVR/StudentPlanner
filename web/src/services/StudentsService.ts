import { IStudent } from "studentplanner-functions/shared/contract/IStudent";
import { Firebase } from "./FirebaseInitializer";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class StudentsService extends FirestoreServiceBase<IStudent> {
    protected readonly collectionRef = Firebase.firestore().collection("students");

    protected cleanBeforePersistToFirestore(model: IStudent): IStudent {
        model.isConfirmed = model.isConfirmed === true;
        model.isPlanned = model.isPlanned === true;
        return model;
    }
}
