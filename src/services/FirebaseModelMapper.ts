import { IFirestoreEntityBase } from "../entities/IFirestoreEntityBase";

export class FirebaseModelMapper {

    public static mapDocsToObjects<T extends IFirestoreEntityBase>(docSnaps: firebase.firestore.DocumentSnapshot[]): T[] {
        return docSnaps.map((docSnap) => FirebaseModelMapper.mapDocToObject<T>(docSnap));
    }

    public static mapDocToObject<T extends IFirestoreEntityBase>(docSnap: firebase.firestore.DocumentSnapshot): T {
        const obj = {
            ...FirebaseModelMapper.nullToUndefined(docSnap.data()),
            id: docSnap.id,
        };
        return obj as T;
    }

    private static nullToUndefined(data: firebase.firestore.DocumentData | undefined): firebase.firestore.DocumentData | undefined {
        if (data === undefined) {
            return undefined;
        }
        Object.keys(data).forEach((key) => {
            if (data[key] === null) {
                data[key] = undefined;
            }
        });
        return data;
    }
}