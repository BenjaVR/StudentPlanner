import { Language } from "../translations/types";

export interface IFirebaseFunctionParam<T> {
    lang: Language;
    data: T;
}

export interface IFirebaseFunctionResponse<T> {
    // TODO
}
