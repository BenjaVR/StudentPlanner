import firebase from "firebase";
import { Firebase } from "../config/FirebaseInitializer";
import { FirebaseModelMapper } from "./FirebaseModelMapper";

interface IObjectToClean {
    [key: string]: any;
}

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
                    this.catchErrorDev(error);
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

            const cleanedObj = this.cleanUndefinedFieldsInObjects(obj, false);

            this.collectionRef.add(cleanedObj)
                .then((docRef) => {
                    return docRef.get();
                })
                .then((doc) => {
                    resolve(FirebaseModelMapper.mapDocToObject<T>(doc));
                })
                .catch((error) => {
                    this.catchErrorDev(error);
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

            const cleanedObj = this.cleanUndefinedFieldsInObjects(obj, true);

            this.collectionRef.doc(id).update(cleanedObj)
                .then(() => resolve())
                .catch((error) => {
                    this.catchErrorDev(error);
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
                    this.catchErrorDev(error);
                    reject(error);
                });
        });
    }

    private cleanUndefinedFieldsInObjects(obj: IObjectToClean, forceDeleteInFirestore: boolean): object {
        Object.keys(obj).forEach((key) => {
            if (obj[key] === undefined) {
                if (forceDeleteInFirestore) {
                    obj[key] = Firebase.firestore.FieldValue.delete();
                } else {
                    delete obj[key];
                }
            }
        });
        return obj;
    }

    private catchErrorDev(error: any): void {
        if (process.env.NODE_ENV === "development") {
            // tslint:disable-next-line:no-console
            console.log(error);
        }
    }
}
