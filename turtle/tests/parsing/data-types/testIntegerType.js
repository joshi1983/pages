import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { processTestCases } from './processTestCases.js';
import { stringToSingleType } from './stringToSingleType.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';
await DataTypes.asyncInit();

function wrappedEquals(logger) {
	return function(types1, types2) {
		const type1 = stringToSingleType(types1);
		const type2 = stringToSingleType(types2);
		return type1.equals(type2);
	};
}

function testEquals(logger) {
	const cases = [
		{'inArgs': ['int', 'int(min=0)'], 'out': false},
		{'inArgs': ['int(min=1)', 'int(min=2)'], 'out': false},
		{'inArgs': ['int', 'int'], 'out': true},
		{'inArgs': ['int(min=0)', 'int(min=0)'], 'out': true},
		{'inArgs': ['int(min=1)', 'int(min=1)'], 'out': true},
		{'inArgs': ['int', 'num(min=0)'], 'out': false},
		{'inArgs': ['int(min=0)', 'num(min=0)'], 'out': false},
	];
	testInOutPairs(cases, wrappedEquals(logger), logger);
}

function wrappedGetIntersectionWith(type1, type2) {
	let intType = type1;
	let other = type2;
	if (intType.name !== 'int') {
		[intType, other] = [other, intType];
	}
	const resultType = intType.getIntersectionWith(other);
	return resultType.toString();
}

function testGetIntersectionWith(logger) {
	const cases = [
		{'inArgs': ['int', 'int(min=0)'], 'out': 'int(min=0)'},
		{'inArgs': ['int', 'int'], 'out': 'int'},
		{'inArgs': ['int(min=0)', 'int(min=1)'], 'out': 'int(min=1)'},
		{'inArgs': ['int(min=-2)', 'int(min=1)'], 'out': 'int(min=1)'},
		{'inArgs': ['int(min=0)', 'int(min=-2)'], 'out': 'int(min=0)'}
	];
	cases.forEach(function(info) {
		info.inArgs = info.inArgs.map(str => new DataTypes(str).types.values().next().value);
	});
	testInOutPairs(cases, wrappedGetIntersectionWith, logger);
}

function testIsCompatible(logger) {
	const intType = DataTypes.createFromName('int');
	const cases = [
		{'s': 'true', 'isCompatible': false}, 
		{'s': 'false', 'isCompatible': false},
		{'s': '"x', 'isCompatible': false},
		{'s': 'end', 'isCompatible': false},
		{'s': '[]', 'isCompatible': false},
		{'s': '\n', 'isCompatible': false},
		{'s': '3.14', 'isCompatible': false},
		{'s': '3', 'isCompatible': true},
		{'s': '-5', 'isCompatible': true},
		{'s': '0', 'isCompatible': true}
	];
	processTestCases(cases, logger, intType);
	
	const cases1 = [
		{'s': '2', 'isCompatible': true},
		{'s': '1', 'isCompatible': true},
		{'s': '0', 'isCompatible': true},
		{'s': '-1', 'isCompatible': false},
		{'s': '-2', 'isCompatible': false},
	];
	const intMin0Type = new DataTypes('int(min=0)');
	processTestCases(cases1, prefixWrapper('Testing with int(min=0)', logger), intMin0Type);
}

export function testIntegerType(logger) {
	wrapAndCall([
		testEquals,
		testGetIntersectionWith,
		testIsCompatible
	], logger);
};