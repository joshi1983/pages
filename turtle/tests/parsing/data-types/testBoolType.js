import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { BooleanType } from '../../../modules/parsing/data-types/BooleanType.js';
import { processTestCases } from './processTestCases.js';

function testIntersectsWith(logger) {
	const cases = [
		{'in': 'bool', 'out': true},
		{'in': 'num', 'out': false},
		{'in': 'color', 'out': false},
		{'in': 'colorstring', 'out': false},
		{'in': 'colorlist', 'out': false},
		{'in': 'list', 'out': false},
		{'in': 'string', 'out': false},
	];
	const b = new BooleanType();
	cases.forEach(function(caseInfo) {
		const otherType = DataTypes.createFromName(caseInfo.in);
		const actualResult = b.intersectsWith(otherType);
		if (actualResult !== caseInfo.out)
			logger('Expected ' + caseInfo.out + ' but got ' + actualResult +
				' while testing BooleanType intersectsWith ' + caseInfo.in);
	});
}

function testIsCompatible(logger) {
	const boolType = DataTypes.createFromName('bool');
	const cases = [
		{'s': 'true', 'isCompatible': true}, 
		{'s': 'false', 'isCompatible': true},
		{'s': '"x', 'isCompatible': false},
		{'s': 'end', 'isCompatible': false},
		{'s': '\n', 'isCompatible': false}
	];
	processTestCases(cases, logger, boolType);
}

export function testBoolType(logger) {
	testIntersectsWith(logger);
	testIsCompatible(logger);
};