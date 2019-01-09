import { IFirebaseTable } from "./FirestoreServiceBase";

export class FirebaseModelMapper {

    public static mapDocsToObject<T extends IFirebaseTable>(docSnaps: firebase.firestore.DocumentSnapshot[]): T[] {
        return docSnaps.map((docSnap) => FirebaseModelMapper.mapDocToObject<T>(docSnap));
    }

    public static mapDocToObject<T extends IFirebaseTable>(docSnap: firebase.firestore.DocumentSnapshot): T {
        const obj = {
            ...docSnap.data(),
            id: docSnap.id,
        };
        return obj as T;
    }
}
