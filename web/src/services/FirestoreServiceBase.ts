import firebase from "firebase";
import { IFirebaseTable } from "studentplanner-functions/shared/contract/IFirebaseTable";
import { FirebaseModel } from "../models/FirebaseModel";
import { FirebaseDtoMapper } from "./FirebaseDtoMapper";
import { Firebase } from "./FirebaseInitializer";

interface IObjectToClean {
    [key: string]: any;
}

export type OrderByType = "asc" | "desc";

export type ListenOnChangeFunc<T> = (objects: T[], size: number) => void;

export abstract class FirestoreServiceBase<T extends IFirebaseTable, M extends FirebaseModel<T>> {

    protected readonly abstract collectionRef: firebase.firestore.CollectionReference;

    public subscribe(onChange: ListenOnChangeFunc<M>, orderBy: keyof T = "updatedTimestamp", orderByType: OrderByType = "desc"): () => void {
        return this.collectionRef.orderBy(orderBy as string, orderByType)
            .onSnapshot((change): void => {
                const dtos = FirebaseDtoMapper.mapDocsToObjects<T>(change.docs);
                const models = dtos.map((dto) => this.mapDtoToModel(dto));
                onChange(models, change.size);
            });
    }

    public get(id: string): Promise<M> {
        return new Promise<M>((resolve, reject) => {
            this.collectionRef.doc(id).get()
                .then((docSnap) => {
                    const dto = FirebaseDtoMapper.mapDocToObject<T>(docSnap);
                    const model = this.mapDtoToModel(dto);
                    resolve(model);
                })
                .catch((error) => {
                    this.catchErrorDev(error);
                    reject(error);
                });
        });
    }

    public add(obj: T): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (obj.id !== undefined) {
                return reject("Cannot add an object which already has an id!");
            }

            const now = Firebase.firestore.Timestamp.now();
            obj.createdTimestamp = now;
            obj.updatedTimestamp = now;

            const cleanedObj = this.cleanUndefinedAndWhitespaceFieldsInObjects(obj);

            this.collectionRef.add(cleanedObj)
                .then(() => resolve())
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

            const cleanedObj = this.cleanUndefinedAndWhitespaceFieldsInObjects(obj);

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

    protected catchErrorDev(error: any): void {
        if (process.env.NODE_ENV === "development") {
            // tslint:disable-next-line:no-console
            console.log(error);
        }
    }

    protected abstract mapDtoToModel(dto: T): M;

    private cleanUndefinedAndWhitespaceFieldsInObjects(obj: IObjectToClean): object {
        Object.keys(obj).forEach((key) => {
            if (obj[key] === undefined || obj[key] === "") {
                obj[key] = null;
            }
        });
        return obj;
    }
}
