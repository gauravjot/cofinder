export interface ResponseType<T> {
	success: boolean;
	res: T;
}

export interface ApiError {
	statusCode: string;
	message: string;
}

export interface ApiCourseType {
	hello: string;
}
