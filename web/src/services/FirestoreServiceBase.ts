import firebase from "firebase";
import { Firebase } from "../config/FirebaseInitializer";
import { FirebaseModelMapper } from "./FirebaseModelMapper";

export type OrderByType = "asc" | "desc";

export type ListenOnChangeFunc<T> = (objects: T[], size: number) => void;

export interface IFirebaseTable {
    id?: string;
    createdTimestamp?: firebase.firestore.Timestamp;
    updatedTimestamp?: firebase.firestore.Timestamp;
}

export abstract class FirestoreServiceBase<T extends IFirebaseTable> {

    protected readonly abstract collectionRef: firebase.firestore.CollectionReference;

    public subscribe(onChange: ListenOnChangeFunc<T>, orderBy: keyof T = "updatedTimestamp", orderByType: OrderByType = "desc"): void {
        this.collectionRef.orderBy(orderBy as string, orderByType)
            .onSnapshot((change): void => {
                const mappedDocs = FirebaseModelMapper.mapDocsToObject<T>(change.docs);
                onChange(mappedDocs, change.size);
            });
    }

    public get(id: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.collectionRef.doc(id).get()
                .then((docSnap) => {
                    const mappedDoc = FirebaseModelMapper.mapDocToObject<T>(docSnap);
                    resolve(mappedDoc);
                })
                .catch((error) => {
                    catchErrorDev(error);
                    reject(error);
                });
        });
    }

    public add(obj: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (obj.id !== undefined) {
                return reject("Cannot add a object which already has an id!");
            }

            const now = Firebase.firestore.Timestamp.now();
            obj.createdTimestamp = now;
            obj.updatedTimestamp = now;

            this.collectionRef.add(obj)
                .then((docRef) => {
                    return docRef.get();
                })
                .then((doc) => {
                    resolve(FirebaseModelMapper.mapDocToObject<T>(doc));
                })
                .catch((error) => {
                    catchErrorDev(error);
                    reject(error);
                });
        });
    }

    public update(obj: T): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (obj.id === undefined) {
                return reject("Id is undefined");
            }

            const id = obj.id;
            delete obj.id;
            obj.updatedTimestamp = Firebase.firestore.Timestamp.now();

            // Change all "undefined" to "delete()", because Firestore wants this.
            const objToClean: { [key: string]: any } = obj;
            Object.keys(objToClean).forEach((key) => {
                if (objToClean[key] === undefined) {
                    objToClean[key] = Firebase.firestore.FieldValue.delete();
                }
            });

            this.collectionRef.doc(id).update(objToClean)
                .then(() => resolve())
                .catch((error) => {
                    catchErrorDev(error);
                    reject(error);
                });
        });
    }

    public delete(obj: T): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (obj.id === undefined) {
                return reject("Id is undefined");
            }

            this.collectionRef.doc(obj.id).delete()
                .then(resolve)
                .catch((error) => {
                    catchErrorDev(error);
                    reject(error);
                });
        });
    }
}

function catchErrorDev(error: any): void {
    if (process.env.NODE_ENV === "development") {
        // tslint:disable-next-line:no-console
        console.log(error);
    }
}
