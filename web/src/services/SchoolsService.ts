import { ISchool } from "@studentplanner/functions/dist/shared/models/School";
import { FirestoreServiceBase } from "./firestore/FirestoreServiceBase";
import { FirebaseFunctions } from "./functions/FirebaseFunctions";

export class SchoolsService extends FirestoreServiceBase {

    private static instance: SchoolsService;

    private readonly schoolsCollection = "schools";
    private readonly schoolsRef = this.firestore.collection(this.schoolsCollection);

    public static getInstance(): SchoolsService {
        if (this.instance === undefined) {
            this.instance = new SchoolsService();
        }
        return this.instance;
    }

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
            FirebaseFunctions.addSchoolFunction({ school })
                .then(() => {
                    resolve();
                })
                .catch(reject);
        });
    }
}
