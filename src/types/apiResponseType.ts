export enum FetchState {
	Fetching = -1,
	Error = -2,
	Incomplete = -3,
}

export interface ResponseType<T> {
	success: boolean;
	res: T;
}

export interface ApiError {
	message: string;
}

export interface QueryScheduleSaveType {
	term: string;
	schedules: string[];
}
