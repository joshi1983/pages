import { numericValuesToDataType } from
'../../../modules/parsing/data-types/numericValuesToDataType.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

function wrappedNumericValuesToDataType(values) {
	return numericValuesToDataType(values).toString();
}

export function testNumericValuesToDataType(logger) {
	const cases = [
		{'in': [-2], 'out': 'int(max=-2,min=-2)'},
		{'in': [0], 'out': 'int(max=0,min=0)'},
		{'in': [1], 'out': 'int(max=1,min=1)'},
		{'in': [2], 'out': 'int(max=2,min=2)'},
		{'in': [1.5], 'out': 'num(finite,max=1.5,min=1.5)'},
		{'in': [2.5], 'out': 'num(finite,max=2.5,min=2.5)'},
		{'in': [1.5, 2], 'out': 'num(finite,max=2,min=1.5)'},
		{'in': [1.5,Infinity], 'out': 'num(min=1.5)'},
		{'in': [1.5,-Infinity], 'out': 'num(max=1.5)'},
	];
	testInOutPairs(cases, wrappedNumericValuesToDataType, logger);
};