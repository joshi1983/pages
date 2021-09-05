import { getRequiredTypesIn } from
'../../../../../../modules/parsing/qbasic/parsing/parse-tree-analysis/variable-data-types/getRequiredTypesIn.js';
import { parse } from
'../../../../../../modules/parsing/qbasic/parse.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetRequiredTypesIn(logger) {
	const cases = [
	{'code': `print x * 4`,
	'result': 'num'},
	{'code': `print 2 ^ x`,
	'result': 'num'},
	{'code': `sleep x`,
	'result': 'num'},
	{'code': `screen x`,
	'result': 'int'},
	{'code': 'print :x = :x + 5',
	'result': 'num'},
	{'code': ' tip = tip * x',
	'result': 'num'},
	{'code': ` tip = tip / 100
 tip = tip * x`, 'result': 'num'}
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const token = parseResult.root;
		const result = getRequiredTypesIn('x', token);
		if (result !== caseInfo.result)
			plogger(`Expected result of ${caseInfo.result} but found ${result}`);
	});
};