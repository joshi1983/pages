import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { validateDataTypeString } from
'../../../../modules/parsing/data-types/data-type-parsing/validateDataTypeString.js';

export function testValidateDataTypeString(logger) {
	const cases = [
	{'in': '', 'valid': true},
	{'in': '*', 'valid': true},
	{'in': 'list', 'valid': true},
	{'in': 'num', 'valid': true},
	{'in': 'list<num>', 'valid': true},
	{'in': 'list|string', 'valid': true},
	{'in': 'list<num>|string', 'valid': true},
	{'in': 'list(minlen=2)', 'valid': true},
	{'in': 'list<num>(minlen=3)', 'valid': true},
	{'in': 'list<*>', 'valid': true},
	{'in': 'list<list<num>>(minlen=2)', 'valid': true},
	{'in': 'list<list<num>(minlen=3)>(minlen=3)', 'valid': true},
	{'in': 'list<list<int>(minlen=2)>(minlen=2)', 'valid': true},
	{'in': 'list(minlen=1)|string(minlen=1)', 'valid': true},
	{'in': 'list<>', 'valid': false},
	{'in': 'list()', 'valid': false},
	{'in': 'lists<num>', 'valid': false}, // list is recognized but lists is not.
	{'in': '*<num>', 'valid': false},
	{'in': '*(minlen=3)', 'valid': false},
	{'in': 'list(minlen=3)(minlen=4)', 'valid': false},
	{'in': 'list(minlen=)', 'valid': false},
	{'in': 'list(=3)', 'valid': false},
	{'in': '|>', 'valid': false},
	{'in': '|', 'valid': false},
	{'in': 'num|>', 'valid': false},
	{'in': 'list<num>|>', 'valid': false},
	{'in': 'list<num><string>', 'valid': false},
	{'in': 'num|>string', 'valid': false},
	{'in': 'minlen=2', 'valid': false},
	{'in': ')', 'valid': false},
	{'in': '(', 'valid': false},
	{'in': ' ', 'valid': false}, // spaces not allowed
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in=${caseInfo.in}`, logger);
		const result = validateDataTypeString(caseInfo.in);
		if ((result === undefined) !== caseInfo.valid) {
			if (caseInfo.valid)
				plogger(`Expected to indicate valid but got the message ${result}`);
			else
				plogger(`Expected to get a validation message but got ${result}`);
		}
	});
};