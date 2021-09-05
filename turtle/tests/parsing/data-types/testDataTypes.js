import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

function testAllTypes(logger) {
	const types = DataTypes.getAssignableTypesArray();
	const s = new DataTypes(types).toString();
	const expectedS = 'bool|easing|gradient|list|num|plist|string|transparent';
	if (expectedS !== s)
		logger('Expected ' + expectedS + ' but got ' + s);
}

function testParseAndCreateFromName(logger) {
	const typeNames = ["bool", "color", "int", "list", "num", "string"];
	typeNames.forEach(function(typeName) {
		const actualResultSet = DataTypes.parse(typeName);
		if (actualResultSet.size !== 1)
			logger('Expected to get 1 type but got ' + actualResultSet.size + ' for name ' + typeName);
		else {
			const actualResult = actualResultSet.values().next().value;
			if (actualResult.name !== typeName)
				logger('name expected to be ' + typeName + ' but got ' + actualResult.name);
		}
		const createdResult = DataTypes.createFromName(typeName);
		if (createdResult.name !== typeName)
			logger('name expected to be ' + typeName + ' but got ' + createdResult.name);
	});
	const types = DataTypes.parse('bool|list');
	if (!(types instanceof Set))
		logger('Expected to get a Set from DataTypes.parse');
}

function testMayBeCompatibleWith(logger) {
	const cases = [
		{'types': 'num', 'token': new ParseTreeToken(3, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL), 'result': true},
		{'types': 'num', 'token': new ParseTreeToken('hi', null, 0, 0, ParseTreeTokenType.STRING_LITERAL), 'result': false},
		{'types': 'num', 'token': new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.LIST), 'result': false},
		{'types': 'string', 'token': new ParseTreeToken('hi', null, 0, 0, ParseTreeTokenType.STRING_LITERAL), 'result': true},
	];
	cases.forEach(function(caseInfo, index) {
		const types = new DataTypes(caseInfo.types);
		const result = types.mayBeCompatibleWith(caseInfo.token);
		const plogger = prefixWrapper('Index ' + index + ', types = ' + caseInfo.types + ', token val = ' + caseInfo.token.val, logger);
		if (result !== caseInfo.result)
			plogger('Expected ' + caseInfo.result + ' but got ' + result);
	});
}

function testGetTypesCompatibleWithValue(logger) {
	const cases = [
		{'in': 5, 'result': 'int'},
		{'in': -1000000, 'result': 'int'},
		{'in': true, 'result': 'bool'},
		{'in': false, 'result': 'bool'},
		{'in': 3.4, 'result': 'num'},
		{'in': "hello", 'result': 'string'},
		{'in': [], 'result': 'list'},
		{'in': 'red', 'result': 'colorstring'},
		{'in': '#123', 'result': 'colorstring'},
		{'in': '#1234', 'result': 'alphacolorstring'},
		{'in': [1, 2, 3], 'result': 'colorlist'},
		{'in': [1, 2, 3, 4], 'result': 'alphacolorlist'}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = DataTypes.getTypesCompatibleWithValue(caseInfo.in, {
			'procedures': new Map()
		}).toString();
		if (result !== caseInfo.result)
			plogger('Expected ' + caseInfo.result + ' for value ' + caseInfo.in + ' but got ' + result);
	});
}

function testEquals(logger) {
	const types = ['bool', 'color', 'colorlist', 'colorstring', 'list',
		'num', 'plist', 'string', 'transparent'];
	types.forEach(function(typeStr) {
		const val1 = new DataTypes(typeStr);
		const val2 = new DataTypes(typeStr);
		if (val1.equals(val2) !== true)
			logger('Expected true but got ' + val1.equals(val2));
	});
	const cases = [
		['', '', true],
		['plist', 'list', false],
		['list|plist', 'list', false],
		['list|plist', 'plist|list', true],
	];
	cases.forEach(function(caseInfo) {
		const val1 = new DataTypes(caseInfo[0]);
		const val2 = new DataTypes(caseInfo[1]);
		if (val1.equals(val2) !== caseInfo[2])
			logger(`Expected ${caseInfo[2]} but got ${val1.equals(val2)} for new DataTypes(${val1.toString()}).equals(${val2.toString()})`);
	});
}

export function testDataTypes(logger) {
	testAllTypes(prefixWrapper('testAllTypes', logger));
	testEquals(prefixWrapper('testEquals', logger));
	testGetTypesCompatibleWithValue(prefixWrapper('testGetTypesCompatibleWithValue', logger));
	testMayBeCompatibleWith(prefixWrapper('testMayBeCompatibleWith', logger));
	testParseAndCreateFromName(prefixWrapper('testParseAndCreateFromName', logger));
};