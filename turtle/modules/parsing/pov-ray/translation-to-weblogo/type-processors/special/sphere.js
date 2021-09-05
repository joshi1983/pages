import { PovRayCommand } from '../../../PovRayCommand.js';
import { processTokenOrString } from '../processTokenOrString.js';
import { processToken } from '../processToken.js';
import { updateProperties } from './updateProperties.js';

export function sphere(token, result, settings) {
	const info = PovRayCommand.getCommandInfo('sphere');
	const locationName = info.args[0].subArgs[0].name;
	const radiusName = info.args[0].subArgs[1].name;
	let props = new Map([
		[locationName, ''],
		[radiusName, '100'],
	]);
	updateProperties(token, props);
	const locationVal = props.get(locationName);
	const radiusVal = props.get(radiusName);
	if (locationVal !== '') {
		result.append('\njumpTo ');
		processTokenOrString(locationVal, result);
		result.append('\n');
	}
	result.append(' sphere ');
	processTokenOrString(radiusVal, result);
	result.append(' ');
};