import { Operators } from
'../../../../modules/parsing/Operators.js';
import { processValidationTestCases } from './processValidationTestCases.js';
import { interestingVals, validateComparisonOperatorDataTypes } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateComparisonOperatorDataTypes.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

function testGeneral(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'print 1 > 2', 'error': false},
		{'code': 'print 1 = 2', 'error': false},
		{'code': 'print 1 < 2', 'error': false},
		{'code': 'print 1 >= 2', 'error': false},
		{'code': 'print 1 <= 2', 'error': false},
		{'code': 'print 1 > "hi', 'error': false, 'warning': true},
		{'code': 'print 1 = "hi', 'error': false, 'warning': true},
		{'code': 'print 1 < "hi', 'error': false, 'warning': true},
		{'code': 'print 1 >= "hi', 'error': false, 'warning': true},
		{'code': 'print 1 <= "hi', 'error': false, 'warning': true},
		{'code': 'print "hi > 3', 'error': false, 'warning': true},
		{'code': 'print createPList > 3', 'error': false, 'warning': true},
		{'code': 'print [] > 3', 'error': false, 'warning': true},
		{'code': 'print true > 3', 'error': false, 'warning': true},
		{'code': 'print false > 3', 'error': false, 'warning': true},
		{'code': 'print false > 3', 'error': false, 'warning': true},
	];
	processValidationTestCases(cases, logger, validateComparisonOperatorDataTypes);
}

function testInterestingVals(logger) {
	for (const symbol of interestingVals) {
		const info = Operators.getOperatorInfo(symbol);
		if (info === undefined) {
			logger(`No information on operator ${symbol}`);
		}
	}
}

export function testValidateComparisonOperatorDataTypes(logger) {
	wrapAndCall([
		testGeneral,
		testInterestingVals
	], logger);
};