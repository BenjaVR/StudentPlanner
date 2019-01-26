import { IFirebaseTable } from "studentplanner-functions/shared/contract/IFirebaseTable";

abstract class FirebaseModel<T extends IFirebaseTable> {

    public readonly id: string | undefined;
    public readonly createdTimestamp: firebase.firestore.Timestamp | undefined;
    public readonly updatedTimestamp: firebase.firestore.Timestamp | undefined;

    constructor(dto: T) {
        this.id = dto.id;
        this.createdTimestamp = dto.createdTimestamp;
        this.updatedTimestamp = dto.updatedTimestamp;
    }

    public abstract getDto(): T;
}

export { FirebaseModel };
