import { MultiSelect } from "@/components/ui/common/MultiSelect";
import Multiselect from "multiselect-react-dropdown";
import { useEffect, useRef, memo } from "react";

export interface Props<T> {
	data: T[];
	preSelected?: T | undefined;
	selected: T[];
	setSelected: React.Dispatch<React.SetStateAction<any[]>>;
}

export function CourseBrowserFilter<T>(props: Props<T>) {
	const ref = useRef<Multiselect>(null);

	function onChange(selectedList: T[]) {
		props.setSelected(selectedList);
	}

	function reset() {
		ref.current?.resetSelectedValues();
	}

	useEffect(() => {
		if (props.selected.length < 1) reset();
	}, [props.selected.length]);

	return (
		<>
			<MultiSelect
				reference={ref}
				data={props.data}
				onChange={onChange}
				preSelect={props.preSelected ? [props.preSelected] : undefined}
			/>
		</>
	);
}

export default memo(CourseBrowserFilter);
