import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { NumberType } from '../../../modules/parsing/data-types/NumberType.js';
import { processTestCases } from './processTestCases.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function stringToSingleDataType(s) {
	const dataTypes = new DataTypes(s);
	return dataTypes.types.values().next().value;
}

function testGetIntersionWith(logger) {
	const cases = [
		{'inArgs': ['num', 'num'], 'out': 'num'},
		{'inArgs': ['num(finite)', 'num(unfinite)'], 'out': 'null'},
		{'inArgs': ['num(finite)', 'int'], 'out': 'int'},
		{'inArgs': ['num(unfinite)', 'num'], 'out': 'num(unfinite)'},
		{'inArgs': ['num(finite)', 'num'], 'out': 'num(finite)'},
		{'inArgs': ['num(unfinite)', 'int'], 'out': 'null'},
	];
	// Add test cases with the operands reversed because intersection should give the same result
	// when the operands are swapped.
	for (const case1 of cases.slice()) {
		if (case1.inArgs[0] !== case1.inArgs[1]) {
			const pair = case1.inArgs;
			cases.push({
				'inArgs': [pair[1], pair[0]],
				'out': case1.out
			});
		}
	}
	testInOutPairs(cases, function(type1, type2) {
		type1 = stringToSingleDataType(type1);
		type2 = stringToSingleDataType(type2);
		return '' + type1.getIntersectionWith(type2);
	}, logger);
}

function testIsIntersectableWithNumericType(logger) {
	const cases = [
		{'in': 'color', 'out': true},
		{'in': 'colorlist', 'out': false},
		{'in': 'int', 'out': true},
		{'in': 'num', 'out': true},
		{'in': 'num(finite)', 'out': true},
		{'in': 'num(unfinite)', 'out': true},
		{'in': 'string', 'out': false}
	];
	testInOutPairs(cases, function(typesString) {
		return NumberType.isIntersectableWithNumericType(stringToSingleDataType(typesString))
	}, logger);
}

function testIsIntersectingNumberTypes(logger) {
	const cases = [
		{'inArgs': ['num', 'num'], 'out': true},
		{'inArgs': ['num', 'int'], 'out': true},
		{'inArgs': ['num(finite)', 'int'], 'out': true},
		{'inArgs': ['num(finite)', 'num(unfinite)'], 'out': false},
		{'inArgs': ['num(unfinite)', 'int'], 'out': false},
		{'inArgs': ['num(finite)', 'num'], 'out': true},
		{'inArgs': ['num(unfinite)', 'num'], 'out': true},
	];
	// the order shouldn't change the result value so test with the inArgs reversed also.
	for (const case1 of cases.slice()) {
		if (case1.inArgs[0] !== case1.inArgs[1]) {
			const pair = case1.inArgs;
			cases.push({
				'inArgs': [pair[1], pair[0]],
				'out': case1.out
			});
		}
	}
	testInOutPairs(cases, function(types1, types2) {
		const dType1 = stringToSingleDataType(types1);
		const dType2 = stringToSingleDataType(types2);
		return NumberType.isIntersectingNumberTypes(dType1, dType2);
	}, logger);
}

function testIsSubsetOf(logger) {
	const cases = [
		{'inArgs': ['num', 'num(finite)'], 'out': false},
		{'inArgs': ['num', 'num(unfinite)'], 'out': false},
		{'inArgs': ['num(finite)', 'num(unfinite)'], 'out': false},
		{'inArgs': ['num(unfinite)', 'num(finite)'], 'out': false},
		{'inArgs': ['num(unfinite)', 'num'], 'out': true},
		{'inArgs': ['num(finite)', 'num'], 'out': true},
	];
	testInOutPairs(cases, function(type1, type2) {
		type1 = stringToSingleDataType(type1);
		type2 = stringToSingleDataType(type2);
		return type1.isSubsetOf(type2);
	}, logger);
}

function testLiteralCases(logger) {
	const numType = DataTypes.createFromName('num');
	const cases = [
		{'s': 'true', 'isCompatible': false},
		{'s': 'false', 'isCompatible': false},
		{'s': '"x', 'isCompatible': false},
		{'s': 'end', 'isCompatible': false},
		{'s': '\n', 'isCompatible': false},
		{'s': '3.14', 'isCompatible': true},
		{'s': '3', 'isCompatible': true},
		{'s': '-5', 'isCompatible': true},
		{'s': '0', 'isCompatible': true}
	];
	processTestCases(cases, logger, numType);
}

function testTightenForValue(logger) {
	const cases = [
		{'in': 0, 'out': 'num(finite)'},
		{'in': 1, 'out': 'num(finite)'},
		{'in': 1.1, 'out': 'num(finite)'},
		{'in': -1, 'out': 'num(finite)'},
		{'in': -1.1, 'out': 'num(finite)'},
		{'in': Infinity, 'out': 'num(unfinite)'},
		{'in': -Infinity, 'out': 'num(unfinite)'}
	];
	testInOutPairs(cases, function(val) {
		const num = new NumberType();
		return num.tightenForValue(val).toString();
	}, logger);
};

export function testNumberType(logger) {
	wrapAndCall([
		testGetIntersionWith,
		testIsIntersectableWithNumericType,
		testIsIntersectingNumberTypes,
		testIsSubsetOf,
		testLiteralCases,
		testTightenForValue,
	], logger);
};