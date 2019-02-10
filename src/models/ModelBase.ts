import moment from "moment";
import { IFirestoreEntityBase } from "../entities/IFirestoreEntityBase";
import { Firebase } from "../services/FirebaseInitializer";

type DatabaseAction = "new" | "update" | "updateWithoutTime";

export abstract class ModelBase<T extends IFirestoreEntityBase> {

    public id: string | undefined;
    public createdDate: moment.Moment | undefined;
    public updatedDate: moment.Moment | undefined;

    public getEntity(databaseAction: DatabaseAction): T {
        const entity: T = {
            id: this.id,
            createdTimestamp: this.createdDate === undefined
                ? null
                : Firebase.firestore.Timestamp.fromDate(this.createdDate.toDate()),
            updatedTimestamp: this.updatedDate === undefined
                ? null
                : Firebase.firestore.Timestamp.fromDate(this.updatedDate.toDate()),
            ...this.getEntityInternal(),
        };

        delete entity.id;

        switch (databaseAction) {
            case "new":
                entity.createdTimestamp = Firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp;
                entity.updatedTimestamp = Firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp;
                break;
            case "update":
                // Make sure to not overwrite the createdTimestamp.
                delete entity.createdTimestamp;
                entity.updatedTimestamp = Firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp;
                break;
            case "updateWithoutTime":
                delete entity.createdTimestamp;
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
            // Support one level object nesting:
            if (typeof entityObj[key] === "object" && entityObj[key] !== null) {
                Object.keys(entityObj[key]).forEach((nestedKey) => {
                    if (entityObj[key][nestedKey] === undefined || entityObj[key][nestedKey] === "") {
                        entityObj[key][nestedKey] = null;
                    }
                });
            }
        });

        return entityObj as T;
    }

    protected fillBaseFields(entity: T): void {
        this.id = entity.id;
        this.createdDate = entity.createdTimestamp === undefined
            ? undefined
            : moment(entity.createdTimestamp.toDate());
        this.updatedDate = entity.updatedTimestamp === undefined
            ? undefined
            : moment(entity.updatedTimestamp.toDate());
    }

    protected abstract getEntityInternal(): T;
}
