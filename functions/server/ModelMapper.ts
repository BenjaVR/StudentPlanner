
import { firestore } from "firebase-admin";
import { IFirebaseTable } from "studentplanner-functions/shared/contract/IFirebaseTable";

export class ModelMapper {

    public static mapDocsToObject<T extends IFirebaseTable>(docSnaps: firestore.DocumentSnapshot[]): T[] {
        return docSnaps.map((docSnap) => ModelMapper.mapDocToObject<T>(docSnap));
    }

    public static mapDocToObject<T extends IFirebaseTable>(docSnap: firestore.DocumentSnapshot): T {
        const obj = {
            ...docSnap.data(),
            id: docSnap.id,
        };
        return obj as T;
    }
}
