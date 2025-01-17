import { ISchool } from "../../entities/ISchool";
import { nameof } from "../../helpers/nameof";
import { School } from "../../models/School";
import { FirebaseModelMapper } from "../FirebaseModelMapper";
import { FirestoreRefs } from "../FirestoreRefs";
import { StudentsRepository } from "./StudentsRepository";

export class SchoolsRepository {
    public static subscribeToSchools(onListen: (schools: School[]) => void): () => void {
        return FirestoreRefs.getSchoolCollectionRef()
            .orderBy(nameof<ISchool>("createdTimestamp"), "desc")
            .onSnapshot((querySnapshot) => {
                const schoolEntities = FirebaseModelMapper.mapDocsToObjects<ISchool>(querySnapshot.docs);
                const schools = schoolEntities.map((entity) => School.fromEntity(entity));
                onListen(schools);
            });
    }

    public static async getSchoolsByName(): Promise<School[]> {
        const querySnapshot = await FirestoreRefs.getSchoolCollectionRef()
            .orderBy(nameof<School>("name"), "asc")
            .get();

        const schoolEntities = FirebaseModelMapper.mapDocsToObjects<ISchool>(querySnapshot.docs);
        return schoolEntities.map((entity) => School.fromEntity(entity));
    }

    public static async addSchool(school: School): Promise<void> {
        await FirestoreRefs.getSchoolCollectionRef().add(school.getEntity("new"));
    }

    public static async updateSchool(school: School): Promise<void> {
        if (school.id === undefined) {
            return Promise.reject(Error("School should have an id"));
        }
        await FirestoreRefs.getSchoolDocRef(school.id).update(school.getEntity("update"));
    }

    public static async deleteSchool(school: School): Promise<void> {
        if (school.id === undefined) {
            return Promise.reject(Error("School should have an id"));
        }
        await FirestoreRefs.getSchoolDocRef(school.id).delete();

        // Delete relations on students
        const students = await StudentsRepository.getStudentsWithSchool(school);
        for (const student of students) {
            student.schoolId = undefined;
            await StudentsRepository.updateStudent(student, true);
        }
    }
}
