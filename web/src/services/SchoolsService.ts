import { ISchool } from "../models/School";
import { FirestoreServiceBase } from "./FirestoreServiceBase";

export class SchoolsService extends FirestoreServiceBase<ISchool> {

    private readonly schoolsRef = this.firestore.collection("schools");

    public listSchools(): Promise<ISchool[]> {
        return new Promise<ISchool[]>((resolve, reject) => {
            this.schoolsRef.get()
                .then((snapshot) => {
                    const schools = this.mapQueryDocumentSnapshotsToObject(snapshot.docs);
                    return resolve(schools);
                })
                .catch(reject);
        });
    }

    public addSchool(school: ISchool): Promise<ISchool> {
        return new Promise<ISchool>((resolve, reject) => {
            this.schoolsRef.add(school)
                .then((docRef) => {
                    return docRef.get();
                })
                .then((doc) => {
                    const addedSchool = this.mapQueryDocumentSnapshotToObject(doc);
                    resolve(addedSchool);
                })
                .catch(reject);
        });
    }
}
