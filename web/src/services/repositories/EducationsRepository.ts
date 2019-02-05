import { IEducation } from "../../entities/IEducation";
import { nameof } from "../../helpers/nameof";
import { Education } from "../../models/Education";
import { FirebaseModelMapper } from "../FirebaseModelMapper";
import { FirestoreRefs } from "../FirestoreRefs";
import { DepartmentsRepository } from "./DepartmentsRepository";
import { StudentsRepository } from "./StudentsRepository";

export class EducationsRepository {

    public static subscribeToEducations(onListen: (educations: Education[]) => void): () => void {
        return FirestoreRefs.getEducationCollectionRef()
            .orderBy(nameof<IEducation>("updatedTimestamp"), "desc")
            .onSnapshot((querySnapshot) => {
                const educationEntities = FirebaseModelMapper.mapDocsToObjects<IEducation>(querySnapshot.docs);
                const educations = educationEntities.map((entity) => Education.fromEntity(entity));
                onListen(educations);
            });
    }

    public static async getEducationsByName(): Promise<Education[]> {
        const querySnapshot = await FirestoreRefs.getEducationCollectionRef()
            .orderBy(nameof<IEducation>("name"), "asc")
            .get();

        const educationEntities = FirebaseModelMapper.mapDocsToObjects<IEducation>(querySnapshot.docs);
        const educations = educationEntities.map((entity) => Education.fromEntity(entity));
        return educations;
    }

    public static async addEducation(education: Education): Promise<void> {
        await FirestoreRefs.getEducationCollectionRef()
            .add(education.getEntity("new"));
    }

    public static async updateEducation(education: Education): Promise<void> {
        if (education.id === undefined) {
            return Promise.reject(Error("Education should have an id"));
        }
        await FirestoreRefs.getEducationDocRef(education.id)
            .update(education.getEntity("update"));
    }

    public static async deleteEducation(education: Education): Promise<void> {
        if (education.id === undefined) {
            return Promise.reject(Error("Education should have an id"));
        }

        await FirestoreRefs.getEducationDocRef(education.id)
            .delete();

        // Delete relations on departments
        await DepartmentsRepository.deleteEducationRelations(education);

        // Delete relations on students
        const students = await StudentsRepository.getStudentsWithEducation(education);
        students.forEach(async (student) => {
            student.educationId = undefined;
            await StudentsRepository.updateStudent(student, true);
        });
    }
}
