import { isCompleteKTurtleVersion } from '../../../../modules/parsing/kturtle/scanning/isCompleteKTurtleVersion.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsCompleteKTurtleVersion(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': 'kt', 'out': false},
		{'in': 'kturtle', 'out': false},
		{'in': 'kturtle-', 'out': false},
		{'in': 'kturtle-script', 'out': false},
		{'in': 'kturtle-script-v', 'out': false},
		{'in': 'kturtle-script-v1.0', 'out': true}
	];
	testInOutPairs(cases, isCompleteKTurtleVersion, logger);
};