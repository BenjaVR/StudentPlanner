import moment from "moment";
import { IFirestoreEntityBase } from "../entities/IFirestoreEntityBase";
import { Student } from "../models/Student";

export const emptyFilterOptionValue = "@@__";

export function exactMatchOrDefaultOptionFilter(filterValue: string, recordValue: string | undefined): boolean {
    if (filterValue === emptyFilterOptionValue) {
        return recordValue === undefined || recordValue === null || recordValue === "";
    }
    return filterValue === recordValue;
}

export function hasElementWithId<T extends IFirestoreEntityBase>(elements: T[], id: string | undefined): boolean {
    return elements.filter((e) => e.id !== undefined).some((e) => e.id === id);
}

export function studentsPlannedInDay(students: Student[], date: moment.Moment): Student[] {
    return students.filter((student) => {
        return student.internship !== undefined
            && date.startOf("day").isBetween(
                student.internship.startDate.startOf("day"),
                student.internship.endDate.startOf("day"),
                "day",
                "[]",
            );
    });
}

export function studentsPlannedFullyInRange(students: Student[], from: moment.Moment | undefined, until: moment.Moment | undefined): Student[] {
    return students.filter((student) => {
        return from !== undefined && until !== undefined && student.internship !== undefined
            && student.internship.startDate.isSameOrAfter(from)
            && student.internship.endDate.isSameOrBefore(until);
    });
}

export function studentsPlannedPartiallyInRange(students: Student[], from: moment.Moment | undefined, until: moment.Moment | undefined): Student[] {
    return students.filter((student) => {
        return from !== undefined && until !== undefined && student.internship !== undefined
            && ((student.internship.startDate.isBefore(from) && student.internship.endDate.isSameOrAfter(from))
                || (student.internship.endDate.isAfter(until) && student.internship.startDate.isSameOrBefore(until)));
    });
}
