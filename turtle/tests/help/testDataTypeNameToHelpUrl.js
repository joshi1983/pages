import { dataTypeNameToHelpUrl } from '../../modules/help/dataTypeNameToHelpUrl.js';
import { testInOutPairs } from '../helpers/testInOutPairs.js';

export function testDataTypeNameToHelpUrl(logger) {
	const cases = [
		{'in': 'bool', 'out': 'boolean.html'},
		{'in': 'cproc', 'out': 'cproc.html'},
		{'in': 'int', 'out': 'integer.html'},
		{'in': 'num', 'out': 'number.html'},
		{'in': 'plist', 'out': 'property-list.html'},
	];
	testInOutPairs(cases, dataTypeNameToHelpUrl, logger);
};