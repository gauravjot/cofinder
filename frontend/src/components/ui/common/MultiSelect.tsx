import Multiselect from "multiselect-react-dropdown";

export interface IMultiSelectProps<T> {
	data: T[];
	onChange(selectedList: T[]): void;
	reference: React.RefObject<Multiselect>;
	displayProperty?: string;
	placeholder?: string;
	preSelect?: T[];
}

/**
 * @description Select multiple values from options
 * @returns Array [Component, reset()]
 */
export function MultiSelect<T>(props: IMultiSelectProps<T>) {
	const selector = (
		<Multiselect
			ref={props.reference}
			options={props.data as T}
			onSelect={props.onChange}
			onRemove={props.onChange}
			displayValue={props.displayProperty || "name"}
			placeholder={props.placeholder || "Type or choose..."}
			closeIcon="cancel"
			selectedValues={props.preSelect || false}
			showCheckbox={true}
			avoidHighlightFirstOption={true}
		/>
	);

	return selector;
}
