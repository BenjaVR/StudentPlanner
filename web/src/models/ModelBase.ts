import moment from "moment";
import { IFirestoreEntityBase } from "../entities/IFirestoreEntityBase";
import { Firebase } from "../services/FirebaseInitializer";

type DatabaseAction = "new" | "update";

export abstract class ModelBase<T extends IFirestoreEntityBase> {

    public id: string | undefined;
    public createdDate: moment.Moment | undefined;
    public updatedDate: moment.Moment | undefined;

    public getEntity(databaseAction: DatabaseAction): T {
        const entity: T = {
            id: this.id,
            createdTimestamp: this.createdDate === undefined
                ? null
                : Firebase.firestore.Timestamp.fromDate(this.createdDate.utc().toDate()),
            updatedTimestamp: this.updatedDate === undefined
                ? null
                : Firebase.firestore.Timestamp.fromDate(this.updatedDate.utc().toDate()),
            ...this.getEntityInternal(),
        };

        switch (databaseAction) {
            case "new":
                delete entity.id;
                entity.createdTimestamp = Firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp;
                entity.updatedTimestamp = Firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp;
                break;
            case "update":
                entity.updatedTimestamp = Firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp;
                break;
            default:
                throw new Error("Unsupported database action");
        }

        // Replace "undefined" and empty strings with "null".
        const entityObj = entity as { [key: string]: any };
        Object.keys(entityObj).forEach((key) => {
            if (entityObj[key] === undefined || entityObj[key] === "") {
                entityObj[key] = null;
            }
        });

        return entityObj as T;
    }

    protected abstract getEntityInternal(): T;
}
