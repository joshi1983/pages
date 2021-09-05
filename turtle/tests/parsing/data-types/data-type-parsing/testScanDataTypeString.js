import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { scanDataTypeString } from '../../../../modules/parsing/data-types/data-type-parsing/scanDataTypeString.js';

export function testScanDataTypeString(logger) {
	const cases = [
	{'in': '', 'outVals': []},
	{'in': '*', 'outVals': ['*']},
	{'in': 'list', 'outVals': ['list']},
	{'in': 'list|num', 'outVals': ['list', '|', 'num']},
	{'in': 'list<>', 'outVals': ['list', '<', '>']},
	{'in': 'list<num>|num', 'outVals': ['list', '<', 'num', '>', '|', 'num']},
	{'in': 'list<list<num>>|num', 'outVals': ['list', '<', 'list', '<', 'num', '>', '>', '|', 'num']},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = scanDataTypeString(caseInfo.in);
		if (result.length !== caseInfo.outVals.length)
			plogger(`Expected length to be ${caseInfo.outVals.length} but got ${result.length}`);
		else {
			caseInfo.outVals.forEach(function(outVal, oIndex) {
				if (result[oIndex].s !== outVal)
					plogger(`Expected ${outVal} at result[${oIndex}] but got ${result[oIndex].s}`);
			});
		}
	});
};