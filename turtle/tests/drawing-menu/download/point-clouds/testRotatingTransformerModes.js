import { RotatingTransformerModes } from '../../../../modules/drawing-menu/download/point-clouds/RotatingTransformerModes.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testGetNames(logger) {
	const names = RotatingTransformerModes.getNames();
	if (!(names instanceof Array))
		logger(`Expected names to be an Array but got ${names}`);
	else if (names.length < 2)
		logger(`Expected names to have a length of 2 but got ${names.length}`);
}

function testPopulateSelect(logger) {
	const selectElement = document.createElement('select');
	RotatingTransformerModes.populateSelect(selectElement);
	const options = Array.from(selectElement.querySelectorAll('option'));
	const expectedNumOptions = RotatingTransformerModes.getNames().length;
	if (options.length !== expectedNumOptions)
		logger(`Expected number of options to be ${expectedNumOptions} but got ${options.length}`);
}

export function testRotatingTransformerModes(logger) {
	wrapAndCall([
		testGetNames,
		testPopulateSelect
	], logger);
};