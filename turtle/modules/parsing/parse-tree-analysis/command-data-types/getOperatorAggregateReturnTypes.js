import { getReturnDataTypesFromInputs } from
'../operator-data-types/getReturnDataTypesFromInputs.js';

export function getOperatorAggregateReturnTypes(operator) {
	return function() {
		let result = arguments[0];
		for (let i = 1; i < arguments.length; i++) {
			const nextTypes = arguments[i];
			result = getReturnDataTypesFromInputs(operator, [result, nextTypes]);
		}
		return result;
	};
};