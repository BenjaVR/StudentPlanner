import firebase from "firebase";
import { Firebase } from "../config/FirebaseInitializer";

export type OrderByType = "asc" | "desc";

export type ListenOnChangeFunc<T> = (objects: T[], size: number) => void;

export interface IFirebaseModel {
    id?: string;
    createdTimestamp?: firebase.firestore.Timestamp;
    updatedTimestamp?: firebase.firestore.Timestamp;
}

export abstract class FirestoreServiceBase<T extends IFirebaseModel> {

    protected readonly abstract collectionRef: firebase.firestore.CollectionReference;

    public subscribe(onChange: ListenOnChangeFunc<T>, orderBy: keyof T = "updatedTimestamp", orderByType: OrderByType = "desc"): void {
        this.collectionRef.orderBy(orderBy as string, orderByType)
            .onSnapshot((change): void => {
                const mappedDocs = this.mapDocsToObject(change.docs);
                onChange(mappedDocs, change.size);
            });
    }

    public add(obj: T): Promise<T> {
        return new Promise<T>((resolve, reject): void => {
            const now = Firebase.firestore.Timestamp.now();
            obj.createdTimestamp = now;
            obj.updatedTimestamp = now;

            this.collectionRef.add(obj)
                .then((docRef) => {
                    return docRef.get();
                })
                .then((doc) => {
                    resolve(this.mapDocToObject(doc));
                })
                .catch(reject);
        });
    }

    public update(obj: T): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            if (obj.id === undefined) {
                reject("Id is undefined");
            }

            obj.updatedTimestamp = Firebase.firestore.Timestamp.now();

            this.collectionRef.doc(obj.id).update(obj)
                .then(() => resolve())
                .catch(reject);
        });
    }

    public delete(obj: T): Promise<void> {
        return new Promise<void>((resolve, reject): void => {
            if (obj.id === undefined) {
                reject("Id is undefined");
            }

            this.collectionRef.doc(obj.id).delete()
                .then(resolve)
                .catch(reject);
        });
    }

    protected mapDocsToObject(docSnaps: firebase.firestore.DocumentSnapshot[]): T[] {
        return docSnaps.map(this.mapDocToObject);
    }

    protected mapDocToObject(docSnap: firebase.firestore.DocumentSnapshot): T {
        const obj = {
            ...docSnap.data(),
            id: docSnap.id,
        };
        return obj as T;
    }
}
