import { IInternship } from "studentplanner-functions/shared/contract/IInternship";
import { IStudent } from "studentplanner-functions/shared/contract/IStudent";
import { Firebase } from "./FirebaseInitializer";
import { FirestoreServiceBase } from "./FirestoreServiceBase";
import { StudentsService } from "./StudentsService";

export class InternshipsService extends FirestoreServiceBase<IInternship> {

    protected readonly collectionRef = Firebase.firestore().collection("internships");
    private readonly studentsService = new StudentsService();

    public planInternshipForStudent(student: IStudent, internship: IInternship): Promise<void> {
        if (internship.studentId !== undefined) {
            return Promise.reject("Internship already has an id!");
        }
        if (student.isPlanned === true) {
            return Promise.reject("Student is already planned!");
        }

        return Firebase.firestore().runTransaction(async (transaction) => {
            student.isPlanned = true;
            await this.studentsService.update(student, transaction);
            await super.add(internship);
        });
    }

    public add(internship: IInternship): Promise<void> {
        return Firebase.firestore().runTransaction(async (transaction) => {
            if (internship.studentId !== undefined) {
                return Promise.reject("Internship already has an id!");
            }
            const student = await this.studentsService.get(internship.studentId, transaction);
            student.isPlanned = true;
            await this.studentsService.update(student, transaction);
            await super.add(internship, transaction);
        });
    }

    public update(internship: IInternship): Promise<void> {
        return Firebase.firestore().runTransaction(async (transaction) => {
            if (internship.id === undefined) {
                return Promise.reject("Id on Internship is undefined!");
            }

            // Update previous AND new user's "planned" status
            const previousInternship = await this.get(internship.id, transaction);
            if (previousInternship.studentId !== internship.studentId) {
                if (internship.studentId === undefined) {
                    return Promise.reject("StudentId on Internship is undefined!");
                }

                const student = await this.studentsService.get(internship.studentId, transaction);
                student.isPlanned = true;
                await this.studentsService.update(student, transaction);

                if (previousInternship.studentId !== undefined) {
                    const previousStudent = await this.studentsService.get(previousInternship.studentId, transaction);
                    previousStudent.isPlanned = false;
                    await this.studentsService.update(previousStudent, transaction);
                }
            }

            // Add the internship record
            await super.update(internship, transaction);
        });
    }

    public delete(internship: IInternship): Promise<void> {
        return Firebase.firestore().runTransaction(async (transaction) => {
            // Remove the "isPlanned" status from the student
            if (internship.studentId !== undefined) {
                const student = await this.studentsService.get(internship.studentId, transaction);
                student.isPlanned = false;
                await this.studentsService.update(student, transaction);
            }

            // Delete the internship
            await super.delete(internship, transaction);
        }).catch(this.catchErrorDev);
    }

    protected cleanBeforePersistToFirestore(model: IInternship): IInternship {
        return model;
    }
}
