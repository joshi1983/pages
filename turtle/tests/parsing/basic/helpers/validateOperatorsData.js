import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { QBasicOperators } from
'../../../../modules/parsing/basic/qbasic/QBasicOperators.js';

export function validateOperatorsData(operators, logger) {
	if (!(operators instanceof Array))
		logger(`operators must be an Array but found ${operators}`);
	else {
		operators.forEach(function(operatorInfo, index) {
			if (typeof operatorInfo !== 'object') {
				logger(`Each element in operators must be an object but ${operatorInfo} found at index ${index}`);
				return;
			}
			const plogger = prefixWrapper(`Operator ${index}, from=${operatorInfo.symbol}`, logger);
			if (typeof operatorInfo.symbol !== 'string')
				plogger(`symbol must be a string but found ${operatorInfo.symbol}`);
			else if (index !== 0 && typeof operators[index - 1].symbol === 'string') {
				const prev = operators[index - 1].symbol;
				if (operatorInfo.symbol <= prev)
					plogger(`operators should be sorted alphabetically by symbol but ` +
					`${prev} and ${operatorInfo.symbol} are out of order.`);
			}
			if (operatorInfo.decomposeAssignment !== undefined && typeof operatorInfo.decomposeAssignment !== 'boolean')
				plogger(`decomposeAssignment must be boolean, if specified.  decomposeAssignment=${operatorInfo.decomposeAssignment}`);
			else if (operatorInfo.decomposeAssignment && typeof operatorInfo.symbol === 'string') {
				if (!operatorInfo.symbol.endsWith('='))
					plogger(`Expected symbol to end with = when decomposeAssignment is true. symbol=${operatorInfo.symbol}`);
			}
			const optionalStringKeys = ['to', 'toSymbol'];
			optionalStringKeys.forEach(function(key, index) {
				const val = operatorInfo[key];
				if (val !== undefined && typeof val !== 'string')
					plogger(`${key} must either be undefined or a string but found ${val}`);
			});
			if (operatorInfo.to !== undefined && operatorInfo.toSymbol !== undefined)
				plogger(`to and toSymbol must not be specified on the same operator element`);
			if (typeof operatorInfo.toSymbol === 'string') {
				const qbasicOperator = QBasicOperators.getOperatorInfo(operatorInfo.toSymbol);
				if (qbasicOperator === undefined) {
					plogger(`Unable to find information in QBasic for ${operatorInfo.toSymbol}`);
				}
			}
		});
	}
};