import { helpUrlToFormalName } from '../../modules/help/helpUrlToFormalName.js';
import { testInOutPairs } from '../helpers/testInOutPairs.js';

export function testHelpUrlToFormalName(logger) {
	const cases = [
		{'in': 'easing.html', 'out': 'easing'},
		{'in': 'integer.html', 'out': 'int'},
		{'in': 'number.html', 'out': 'num'},
	];
	testInOutPairs(cases, helpUrlToFormalName, logger);
};