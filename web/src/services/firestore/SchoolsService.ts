import { FirestoreServiceBase } from "../firebase/FirestoreServiceBase";
import { ISchool } from "../interfaces/ISchool";

export class SchoolsService extends FirestoreServiceBase {

    private readonly schoolsCollection = "schools";
    private readonly schoolsRef = this.firestore.collection(this.schoolsCollection);

    public listSchools(): Promise<ISchool[]> {
        return new Promise<ISchool[]>((resolve, reject) => {
            this.schoolsRef.get()
                .then((snapshot) => {
                    const schools: ISchool[] = [];
                    snapshot.docs.forEach((doc) => {
                        const school = {
                            id: doc.id,
                            ...doc.data(),
                        };
                        schools.push(school as ISchool);
                    });
                    return resolve(schools);
                })
                .catch(reject);
        });
    }

    public addSchool(school: ISchool): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.schoolsRef.add(school)
                .then(() => {
                    return resolve();
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }
}
