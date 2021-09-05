import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { StringType } from
'../../../modules/parsing/data-types/StringType.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

function testMayBeCompatibleWithValueMinLen(logger) {
	const cases = [
	{'minLen': undefined, 'checks': [
		{'in': 2, 'out': false},
		{'in': '', 'out': true},
		{'in': 'a', 'out': true},
		{'in': 'ab', 'out': true},
		{'in': 'abc', 'out': true},
	]},
	{'minLen': 2, 'checks': [
		{'in': 2, 'out': false},
		{'in': '', 'out': false},
		{'in': 'a', 'out': false},
		{'in': 'ab', 'out': true},
		{'in': 'abc', 'out': true},
	]},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, minLen=${caseInfo.minLen}`, logger);
		const type = new StringType(caseInfo.minLen);
		for (const check of caseInfo.checks) {
			const result = type.mayBeCompatibleWithValue(check.in);
			if (result !== check.out)
				plogger(`On input of ${check.in}, expected ${check.out} but found ${result}`);
		}
	});
}

function testToString(logger) {
	const cases = [
	{'minLen': undefined, 'out': 'string'},
	{'minLen': 0, 'out': 'string'},
	{'minLen': 1, 'out': 'string(minlen=1)'},
	{'minLen': 2, 'out': 'string(minlen=2)'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, minLen=${caseInfo.minLen}`, logger);
		const type = new StringType(caseInfo.minLen);
		const str = type.toString();
		if (str !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but found ${str}`);
	});
}

export function testStringType(logger) {
	wrapAndCall([
		testMayBeCompatibleWithValueMinLen,
		testToString
	], logger);
};