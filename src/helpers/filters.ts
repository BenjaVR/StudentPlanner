import moment from "moment";
import { IFirestoreEntityBase } from "../entities/IFirestoreEntityBase";
import { Internship } from "../models/internship";

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

export function internshipsInDay(internships: Internship[], date: moment.Moment): Internship[] {
    return internships.filter((internship) => {
        return date.startOf("day").isBetween(
            internship.startDate.startOf("day"),
            internship.endDate.startOf("day"),
            "day",
            "[]",
        );
    });
}
