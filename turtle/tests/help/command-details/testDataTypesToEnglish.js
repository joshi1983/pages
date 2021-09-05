import { dataTypesToEnglish } from '../../../modules/help/command-details/dataTypesToEnglish.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testDataTypesToEnglish(logger) {
	const cases = [
	{'in': 'bool', 'out': 'boolean'},
	{'in': 'list', 'out': 'list'},
	{'in': 'num', 'out': 'number'},
	{'in': 'list<num>', 'out': 'list of numbers'},
	];
	testInOutPairs(cases, dataTypesToEnglish, logger);
};