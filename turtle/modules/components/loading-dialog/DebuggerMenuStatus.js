import { Status } from
'./Status.js';

class DebuggerMenuStatus_ extends Status {
	constructor() {
		super('Loading debug menu', 'Loaded debug menu');
	}
}

export const DebuggerMenuStatus = new DebuggerMenuStatus_();