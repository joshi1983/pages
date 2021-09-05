import { Status } from
'./Status.js';

class SettingsLoadStatus_ extends Status {
	constructor() {
		super('Loading settings', 'Loaded settings');
	}
}

export const SettingsLoadStatus = new SettingsLoadStatus_();

export function setLoadingStatusTitle(newTitle) {
	SettingsLoadStatus.setTitle(newTitle);
};

export function allImported() {
	SettingsLoadStatus.completed();
};