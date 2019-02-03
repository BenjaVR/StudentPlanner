import firebase from "firebase";
import { IFirebaseTable } from "studentplanner-functions/shared/contract/IFirebaseTable";
import { Firebase } from "./FirebaseInitializer";
import { FirebaseModelMapper } from "./FirebaseModelMapper";

interface IObjectToClean {
    [key: string]: any;
}

export type OrderByType = "asc" | "desc";

export type ListenOnChangeFunc<T> = (objects: T[], size: number) => void;

export abstract class FirestoreServiceBase<T extends IFirebaseTable> {

    protected readonly abstract collectionRef: firebase.firestore.CollectionReference;

    public subscribe(onChange: ListenOnChangeFunc<T>, orderBy: keyof T = "updatedTimestamp", orderByType: OrderByType = "desc"): () => void {
        return this.collectionRef.orderBy(orderBy as string, orderByType)
            .onSnapshot((change): void => {
                const mappedDocs = FirebaseModelMapper.mapDocsToObjects<T>(change.docs);
                onChange(mappedDocs, change.size);
            });
    }

    public list(): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            this.collectionRef.get()
                .then((querySnap) => {
                    const mappedDocs = FirebaseModelMapper.mapDocsToObjects<T>(querySnap.docs);
                    return resolve(mappedDocs);
                });
        });
    }

    public async get(id: string, transaction?: firebase.firestore.Transaction): Promise<T> {
        const docRef = this.collectionRef.doc(id);

        try {
            const docSnap = transaction === undefined
                ? await docRef.get()
                : await transaction.get(docRef);
            const mappedDoc = FirebaseModelMapper.mapDocToObject<T>(docSnap);
            return Promise.resolve(mappedDoc);
        } catch (error) {
            this.catchErrorDev(error);
            return Promise.reject(error);
        }
    }

    public async add(obj: T, transaction?: firebase.firestore.Transaction): Promise<void> {
        if (obj.id !== undefined) {
            return Promise.reject("Cannot add an object which already has an id!");
        }

        const now = Firebase.firestore.FieldValue.serverTimestamp();
        obj.createdTimestamp = now as firebase.firestore.Timestamp;
        obj.updatedTimestamp = now as firebase.firestore.Timestamp;

        obj = this.cleanBeforePersistToFirestore(obj);
        const cleanedObj = this.cleanUndefinedAndWhitespaceFieldsInObjects(obj);

        if (transaction === undefined) {
            try {
                await this.collectionRef.add(cleanedObj);
                return Promise.resolve();
            } catch (error) {
                this.catchErrorDev(error);
                return Promise.reject(error);
            }
        } else {
            const newDocRef = this.collectionRef.doc();
            transaction.set(newDocRef, cleanedObj);
            return Promise.resolve();
        }
    }

    public async update(obj: T, transaction?: firebase.firestore.Transaction): Promise<void> {
        if (obj.id === undefined) {
            return Promise.reject("Id is undefined");
        }

        const id = obj.id;
        delete obj.id;
        obj.updatedTimestamp = Firebase.firestore.Timestamp.now();

        obj = this.cleanBeforePersistToFirestore(obj);
        const cleanedObj = this.cleanUndefinedAndWhitespaceFieldsInObjects(obj);

        if (transaction === undefined) {
            try {
                await this.collectionRef.doc(id).update(cleanedObj);
                return Promise.resolve();
            } catch (error) {
                this.catchErrorDev(error);
                return Promise.reject(error);
            }
        } else {
            const docRef = this.collectionRef.doc(id);
            transaction.update(docRef, cleanedObj);
            return Promise.resolve();
        }
    }

    public async delete(obj: T, transaction?: firebase.firestore.Transaction): Promise<void> {
        if (obj.id === undefined) {
            return Promise.reject("Id is undefined");
        }

        if (transaction === undefined) {
            try {
                await this.collectionRef.doc(obj.id).delete();
                return Promise.resolve();
            } catch (error) {
                this.catchErrorDev(error);
                return Promise.reject();
            }
        } else {
            const docRef = this.collectionRef.doc(obj.id);
            transaction.delete(docRef);
            return Promise.resolve();
        }
    }

    protected catchErrorDev(error: any): void {
        if (process.env.NODE_ENV === "development") {
            // tslint:disable-next-line:no-console
            console.log(error);
        }
    }

    protected abstract cleanBeforePersistToFirestore(model: T): T;

    private cleanUndefinedAndWhitespaceFieldsInObjects(obj: IObjectToClean): object {
        Object.keys(obj).forEach((key) => {
            if (obj[key] === undefined || obj[key] === "") {
                obj[key] = null;
            }
        });
        return obj;
    }
}
