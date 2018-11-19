import { Firebase } from "../FirebaseInitializer";

export abstract class FirestoreServiceBase {
    protected readonly firestore = Firebase.firestore();
}
