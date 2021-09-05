import { Status } from
'./Status.js';

class FileMenuStatus_ extends Status {
	constructor() {
		super('Loading file menu', 'Loaded file menu');
	}
}

export const FileMenuStatus = new FileMenuStatus_();

export function fileStatusCompleted() {
	FileMenuStatus.completed();
};

export function setFileStatusTitle(newTitle) {
	FileMenuStatus.setTitle(newTitle);
};