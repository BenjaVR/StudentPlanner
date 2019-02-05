import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { IStudent } from "../shared/contract/IStudent";
import { ModelMapper } from "./ModelMapper";

admin.initializeApp();
const firestore = admin.firestore();
firestore.settings({
    timestampsInSnapshots: true,
});

exports.onSchoolDelete = functions.firestore.document("/schools/{id}").onDelete((snapshot) => {
    const schoolId = snapshot.id;

    // Delete relations on students
    const schoolIdField: keyof IStudent = "schoolId";
    const studentsPromise = firestore.collection("/students")
        .where(schoolIdField, "==", schoolId)
        .get()
        .then((querySnapshot) => {
            const innerPromises = [];

            const mappedStudents = ModelMapper.mapDocsToObjects<IStudent>(querySnapshot.docs);
            mappedStudents.forEach((student) => {
                const updatedStudent = {
                    [schoolIdField]: admin.firestore.FieldValue.delete(),
                };
                innerPromises.push(firestore.doc(`/students/${student.id}`).update(updatedStudent));
            });

            return Promise.all([innerPromises]);
        });

    return Promise.all([studentsPromise]);
});

exports.onEducationDelete = functions.firestore.document("/educations/{id}").onDelete((snapshot) => {
    const educationId = snapshot.id;

    // Delete relations on students
    const educationIdField: keyof IStudent = "educationId";
    const studentsPromise = firestore.collection("/students")
        .where(educationIdField, "==", educationId)
        .get()
        .then((querySnapshot) => {
            const innerPromises = [];

            const mappedStudents = ModelMapper.mapDocsToObjects<IStudent>(querySnapshot.docs);
            mappedStudents.forEach((student) => {
                const updatedStudent = {
                    [educationIdField]: admin.firestore.FieldValue.delete(),
                };
                innerPromises.push(firestore.doc(`/students/${student.id}`).update(updatedStudent));
            });

            return Promise.all([innerPromises]);
        });

    return Promise.all([studentsPromise]);
});
