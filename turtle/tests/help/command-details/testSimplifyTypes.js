import { simplifyTypes } from '../../../modules/help/command-details/simplifyTypes.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testSimplifyTypes(logger) {
	const cases = [
		{'in': 'num', 'out': 'num'},
		{'in': 'list<num>', 'out': 'list'},
		{'in': 'list<alphacolor|transparent>', 'out': 'list'},
	];
	testInOutPairs(cases, simplifyTypes, logger);
};