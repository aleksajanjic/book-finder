export interface BookPreview {
	title: string;
	cover_i?: number;
	author_name?: string[];
}

export interface BookDetailsLocationState {
	preview?: BookPreview;
}
