/// <reference types="express" />
import * as functions from "firebase-functions";
export declare const test: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export declare const addSchool: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
