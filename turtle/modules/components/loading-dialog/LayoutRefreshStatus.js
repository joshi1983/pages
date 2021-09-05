import { Status } from
'./Status.js';

class LayoutRefreshStatus_ extends Status {
	constructor() {
		super('Waiting for init layout refresh',
			'Layout refreshed');
	}
};

export const LayoutRefreshStatus = new LayoutRefreshStatus_();

export function layoutStatusSetTitle(newTitle) {
	LayoutRefreshStatus.setTitle(newTitle);
};

export function layoutStatusCompleted() {
	LayoutRefreshStatus.completed();
};