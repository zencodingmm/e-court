import React from 'react';
import { CalendarChangeEvent } from 'primereact/calendar';
import { CheckboxChangeEvent } from 'primereact/checkbox';

export interface EDocument {
    case_id?: number;
    case_no: string;
    date_of_submittion?: Date;
    description_of_submittion?: string;
    submitting_person?: string;
    interpretation_of_tribunal?: string;
    date_of_submission?: Date;
    date_of_decision?: Date;
    decided?: string;
    created_at?: Date;
    updated_at?: Date;
    current: boolean;
}

export type OnChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | CalendarChangeEvent | CheckboxChangeEvent;

export interface UserType {
    user_type_id?: number;
    type: string;
    description: string;
}

const myFile = File
myFile.prototype.objectURL = ''

export interface User extends UserType {
    user_id?: number;
    user_code: string;
    username: string;
    password: string;
    user_image?: myFile | string;
    user_rank: string;
    locked: boolean;
}

export interface EVote {
    e_vote_id: number;
    description: string;
    created_at: Date;
    current: boolean;
}

export interface EVoteResult extends User {
    voting_result_id: number;
    e_vote_id: number;
    description: string;
    result?: 'support' | 'neutral' | 'not_support';
    created_at: Date;
    comment?: string
}

export interface EDocAttachment {
    attachment_id?: number;
    case_id: number;
    description: string;
    created_at?: Date;
    file_name: string;
    file_type: string;
}

export interface EVoteAttachment {
    attachment_id?: number;
    e_vote_id: number;
    file_name: string;
    file_type: string;
    created_at: Date;
}

export interface Setting {
    setting_id?: number;
    live_streaming_link: string;
    e_lib_link: string;
    case_flow_link: string;
    other_1: string;
    other_2: string;
    current: boolean;
}
