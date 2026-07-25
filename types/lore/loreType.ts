export default interface LoreType {
	_id: string;
	id?: string | null;
	title: string;
	date: Date;
	location: string;
	preview: string;
	story: string[];
	images: string[];
}
