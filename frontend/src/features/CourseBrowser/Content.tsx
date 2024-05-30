import { SectionsBrowserType } from "@/types/dbTypes";
import List from "./List";

export interface ICourseBrowserContentProps {
	data: SectionsBrowserType[];
	isTrustedFilterActive: boolean;
	isKeywordFilterActive: boolean;
}

export default function CourseBrowserContent(props: ICourseBrowserContentProps) {
	return (
		<div className="h-[calc(100vh-120px)] md:h-[calc(100vh-60px)]">
			<div className="w-full h-full overflow-y-hidden">
				<List
					listData={props.data}
					isTFA={props.isTrustedFilterActive}
					isKFA={props.isKeywordFilterActive}
				/>
			</div>
		</div>
	);
}
