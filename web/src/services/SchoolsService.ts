import { Firebase } from "../config/FirebaseInitializer";
import { ISchool } from "../models/School";
import { FirestoreServiceBase, OrderByType } from "./FirestoreServiceBase";

export class SchoolsService extends FirestoreServiceBase<ISchool> {

    private readonly schoolsRef = this.firestore.collection("schools");

    public listSchools(orderBy: keyof ISchool = "updatedDate", orderType: OrderByType = "desc"): Promise<ISchool[]> {
        return new Promise<ISchool[]>((resolve, reject) => {
            this.schoolsRef.orderBy(orderBy, orderType).get()
                .then((snapshot) => {
                    const schools = this.mapQueryDocumentSnapshotsToObject(snapshot.docs);
                    return resolve(schools);
                })
                .catch(reject);
        });
    }

    public addSchool(school: ISchool): Promise<ISchool> {
        return new Promise<ISchool>((resolve, reject) => {
            school.createdDate = school.updatedDate = Firebase.firestore.Timestamp.now();
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

    public editSchool(school: ISchool): Promise<ISchool> {
        return new Promise<ISchool>((resolve, reject) => {
            if (school.id === undefined) {
                return reject();
            }
            school.updatedDate = Firebase.firestore.Timestamp.now();
            this.schoolsRef.doc(school.id).update(school)
                .then(() => {
                    resolve(school);
                })
                .catch(reject);
        });
    }

    public deleteSchool(school: ISchool): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (school.id === undefined) {
                reject();
            }
            this.schoolsRef.doc(school.id).delete()
                .then(resolve)
                .catch(reject);
        });
    }
}
