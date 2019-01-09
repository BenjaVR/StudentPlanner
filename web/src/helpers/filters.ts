import { IFirebaseTable } from "../services/FirestoreServiceBase";

export const emptyFilterOptionValue = "@@__";

export function exactMatchOrDefaultOptionFilter(filterValue: string, recordValue: string | undefined): boolean {
    if (filterValue === emptyFilterOptionValue) {
        return recordValue === undefined || recordValue === null || recordValue === "";
    }
    return filterValue === recordValue;
}

export function hasElementWithId<T extends IFirebaseTable>(elements: T[], id: string | undefined): boolean {
    return elements.filter((e) => e.id !== undefined).some((e) => e.id === id);
}
