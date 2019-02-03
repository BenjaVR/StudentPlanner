import { ISchool } from "../entities/ISchool";
import { nameof } from "../helpers/nameof";
import { School } from "../models/School";
import { FirebaseModelMapper } from "./FirebaseModelMapper";
import { FirestoreRefs } from "./FirestoreRefs";

export class SchoolsRepository {

    public static subscribeToSchools(onListen: (departments: School[]) => void): () => void {
        return FirestoreRefs.getSchoolCollectionRef().onSnapshot((querySnapshot) => {
            const departmentEntities = FirebaseModelMapper.mapDocsToObjects<ISchool>(querySnapshot.docs);
            const departments = departmentEntities.map((entity) => School.fromEntity(entity));
            onListen(departments);
        });
    }

    public static async getSchoolsByName(): Promise<School[]> {
        const querySnapshot = await FirestoreRefs.getSchoolCollectionRef()
            .orderBy(nameof<School>("name"), "asc")
            .get();

        const departmentEntities = FirebaseModelMapper.mapDocsToObjects<ISchool>(querySnapshot.docs);
        const departments = departmentEntities.map((entity) => School.fromEntity(entity));
        return departments;
    }

    public static async addSchool(department: School): Promise<void> {
        await FirestoreRefs.getSchoolCollectionRef()
            .add(department.getEntity("new"));
    }

    public static async updateSchool(department: School): Promise<void> {
        if (department.id === undefined) {
            return Promise.reject(Error("School should have an id"));
        }
        await FirestoreRefs.getSchoolDocRef(department.id)
            .update(department.getEntity("update"));
    }

    public static async deleteSchool(department: School): Promise<void> {
        if (department.id === undefined) {
            return Promise.reject(Error("School should have an id"));
        }
        await FirestoreRefs.getSchoolDocRef(department.id)
            .delete();
    }
}
