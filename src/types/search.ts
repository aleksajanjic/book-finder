export interface SearchProps {
	initialQuery: string;
	onSearch: (value: string) => void;
	onClear: () => void;
}
