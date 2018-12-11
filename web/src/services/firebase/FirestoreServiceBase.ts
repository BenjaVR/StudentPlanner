import { Firebase } from "./FirebaseInitializer";

export abstract class FirestoreServiceBase {
    protected readonly firestore = Firebase.firestore();

    constructor() {
        if (process.env.NODE_ENV === "development") {
            Firebase.firestore.setLogLevel("error");
        } else {
            Firebase.firestore.setLogLevel("silent");
        }
    }
}
