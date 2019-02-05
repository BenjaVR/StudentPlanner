export interface IFirestoreEntityBase {
    id?: string;
    createdTimestamp?: firebase.firestore.Timestamp;
    updatedTimestamp?: firebase.firestore.Timestamp;
}
