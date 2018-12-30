import firebase from "firebase";
import { Firebase } from "../config/FirebaseInitializer";

type DocSnap = firebase.firestore.DocumentSnapshot;

export type OrderByType = "asc" | "desc";

export abstract class FirestoreServiceBase<T> {
    protected readonly firestore = Firebase.firestore();

    protected mapQueryDocumentSnapshotsToObject(docSnaps: DocSnap[]): T[] {
        return docSnaps.map(this.mapQueryDocumentSnapshotToObject);
    }

    protected mapQueryDocumentSnapshotToObject(docSnap: DocSnap): T {
        const obj = {
            ...docSnap.data(),
            id: docSnap.id,
        };
        return obj as any as T;
    }
}
