export interface ResponseType<T> {
	success: boolean;
	res: T;
}

export interface ApiError {
	message: string;
}
