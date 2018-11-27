import { ISchool } from "./interfaces/ISchool";

export interface ISchoolsService {
    listSchools(): Promise<ISchool[]>;
    addSchool(school: ISchool): Promise<void>;
}
