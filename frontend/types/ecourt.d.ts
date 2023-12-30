import React from 'react';
import { CalendarChangeEvent } from 'primereact/calendar';

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
}

export type OnChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | CalendarChangeEvent;

export interface UserType {
    user_type_id?: number;
    type: string;
    description: string;
}

export interface User extends UserType {
    user_id?: number;
    user_code: string;
    user_name: string;
    user_rank: string;
    locked: boolean;
}

export interface EVote {
    e_vote_id: number;
    description: string;
    created_at: Date;
}

export interface EVoteResult {
    voting_result_id: number;
    e_vote_id: number;
    description: string;
    user_id: number;
    user_code: string;
    user_name: string;
    user_rank: string;
    result: boolean;
    created_at: Date;
}
