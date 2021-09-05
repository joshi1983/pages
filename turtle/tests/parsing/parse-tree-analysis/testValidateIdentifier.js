import { validateIdentifier } from '../../../modules/parsing/parse-tree-analysis/validateIdentifier.js';

export function testValidateIdentifier(logger) {
	const cases = [
	{'in': '', 'result': false},
	{'in': '?', 'result': false},
	{'in': '.', 'result': false},
	{'in': ',', 'result': false},
	{'in': '!', 'result': false},
	{'in': '%', 'result': false},
	{'in': '[', 'result': false},
	{'in': ']', 'result': false},
	{'in': '4f', 'result': false},
	{'in': '#f', 'result': false},
	{'in': '&f', 'result': false},
	{'in': '.f', 'result': false},
	{'in': '_', 'result': true},
	{'in': 'h', 'result': true},
	{'in': 'H', 'result': true},
	{'in': 'hello', 'result': true},
	{'in': 'HelLo_', 'result': true},
	{'in': 'hel#lo', 'result': false},
	{'in': 'hel&lo', 'result': false},
	{'in': 'hel.lo', 'result': true},
	{'in': 'hel.lo.world', 'result': true},
	{'in': '.hello', 'result': false},
	{'in': 'even?', 'result': true}
	];
	cases.forEach(function(caseInfo) {
		const msg = validateIdentifier(caseInfo.in);
		if ((msg === undefined) !== caseInfo.result)
			logger('Expected a validity of ' + caseInfo.result + ' but got the message: ' + msg + ' for input of "' + caseInfo.in + '"');
	});
}