import { Firebase } from "../../config/FirebaseInitializer";

export abstract class FirestoreServiceBase {
    protected readonly firestore = Firebase.firestore();
}
