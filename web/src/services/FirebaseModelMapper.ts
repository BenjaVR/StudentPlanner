
import { IFirebaseTable } from "studentplanner-functions/shared/contract/IFirebaseTable";

export class FirebaseModelMapper {

    public static mapDocsToObjects<T extends IFirebaseTable>(docSnaps: firebase.firestore.DocumentSnapshot[]): T[] {
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
