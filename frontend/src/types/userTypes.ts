export type UserType = {
	user: UserInfoType;
	session_id: string;
};

export type UserInfoType = {
	id: number;
	email: string;
	name: string;
	schedule: { [key: string]: string[] };
	joined: string;
	provider_uid: number;
	avatar: string;
	tag: string;
};
