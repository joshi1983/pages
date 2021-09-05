import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { validateDataTypeString } from
'../../../../modules/parsing/data-types/data-type-parsing/validateDataTypeString.js';

export function testValidateDataTypeString(logger) {
	const cases = [
	{'in': '*', 'valid': true},
	{'in': 'list', 'valid': true},
	{'in': 'num', 'valid': true},
	{'in': 'list<num>', 'valid': true},
	{'in': 'list|string', 'valid': true},
	{'in': 'list<num>|string', 'valid': true},
	{'in': 'list<*>', 'valid': true},
	{'in': '|>', 'valid': false},
	{'in': '|', 'valid': false},
	{'in': 'num|>', 'valid': false},
	{'in': 'list<num>|>', 'valid': false},
	{'in': 'num|>string', 'valid': false},
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