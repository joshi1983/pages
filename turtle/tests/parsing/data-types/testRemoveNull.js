import { removeNull } from '../../../modules/parsing/data-types/removeNull.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testRemoveNull(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': undefined, 'out': undefined},
		{'in': 'int', 'out': 'int'},
		{'in': 'null', 'out': ''},
		{'in': 'null|string', 'out': 'string'},
		{'in': 'list|null', 'out': 'list'},
		{'in': 'list|null|string', 'out': 'list|string'}
	];
	testInOutPairs(cases, removeNull, logger);
};