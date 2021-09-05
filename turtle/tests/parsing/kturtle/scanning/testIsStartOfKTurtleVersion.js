import { isStartOfKTurtleVersion } from
'../../../../modules/parsing/kturtle/scanning/isStartOfKTurtleVersion.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

export function testIsStartOfKTurtleVersion(logger) {
	const cases = [
		{'in': '{', 'out': false},
		{'in': 'a', 'out': false},
		{'in': 'kturtle-b', 'out': false},
		{'in': 'kturtle-script-v-', 'out': false},
		{'in': 'kturtle-script-v1a', 'out': false},
		{'in': 'kturtle-script-v1.a', 'out': false},
		{'in': 'kturtle-script-v1.0-', 'out': false},
		{'in': '', 'out': true},
		{'in': 'kt', 'out': true},
		{'in': 'kturtle', 'out': true},
		{'in': 'kturtle-', 'out': true},
		{'in': 'kturtle-script', 'out': true},
		{'in': 'kturtle-script-v', 'out': true},
		{'in': 'kturtle-script-v1', 'out': true},
		{'in': 'kturtle-script-v1.', 'out': true},
		{'in': 'kturtle-script-v1.0', 'out': true}
	];
	testInOutPairs(cases, isStartOfKTurtleVersion, logger);
};