import { Operators } from '../../modules/parsing/Operators.js';
await Operators.asyncInit();

export function validateConvertToUnaryOperator(commandInfo, logger) {
	if (commandInfo.convertToUnaryOperator !== undefined) {
		if (typeof commandInfo.convertToUnaryOperator !== 'string')
			logger(`Expected convertToUnaryOperator to either be undefined or a string but got ${commandInfo.convertToUnaryOperator}`);
		else {
			const operatorInfo = Operators.getOperatorInfo(commandInfo.convertToUnaryOperator);
			if (operatorInfo === undefined)
				logger(`Expected to find a WebLogo operator with symbol ${commandInfo.convertToUnaryOperator} but not found`);
			else if (typeof operatorInfo.unary !== 'object')
				logger(`Expected to find unary information in the WebLogo operator with symbol ${commandInfo.convertToUnaryOperator} but not found.  Check if the operator is strictly binary.`);
		}
	}
};