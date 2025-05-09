import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';
await DataTypes.asyncInit();

function testAllTypes(logger) {
	const types = DataTypes.getAssignableTypesArray();
	const s = new DataTypes(types).toString();
	const expectedS = 'alphacolor|bool|easing|gradient|list|num|plist|string|transparent';
	if (expectedS !== s)
		logger('Expected ' + expectedS + ' but got ' + s);
}

function testParseAndCreateFromName(logger) {
	const typeNames = ["alphacolor", "alphacolorlist", "alphacolorstring", "bool", "color", "colorlist",
	"colorstring", "cproc", "cproc:2", "int", "list", "num", "string"];
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
		{'types': 'list', 'token': new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.LIST), 'result': true},
		{'types': 'num', 'token': new ParseTreeToken(3, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL), 'result': true},
		{'types': 'num', 'token': new ParseTreeToken(3.14, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL), 'result': true},
		{'types': 'int', 'token': new ParseTreeToken(3, null, 0, 0, ParseTreeTokenType.NUMBER_LITERAL), 'result': true},
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
		{'in': [1, 2, 3, 4], 'result': 'alphacolorlist'},
		{'in': [1, 2, 3, 4, 5], 'result': 'list<int>(minlen=5)'},
		{'in': [1.2], 'result': 'list<num>(minlen=1)'},
		{'in': [1, 1.2], 'result': 'list<num>(minlen=2)'},
		{'in': [1, "hi"], 'result': 'list<int|string>(minlen=2)'},
		{'in': [1.2, "hi"], 'result': 'list<num|string>(minlen=2)'},
		{'in': [1, "red"], 'result': 'list<colorstring|int>(minlen=2)'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const result = DataTypes.getTypesCompatibleWithValue(caseInfo.in, {
			'procedures': new Map()
		}).toString();
		if (result !== caseInfo.result)
			plogger(escapeHTML('Expected ' + caseInfo.result + ' for value ' + caseInfo.in + ' but got ' + result));
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
		['*', '', false],
		['plist', 'list', false],
		['list|plist', 'list', false],
		['list|plist', 'plist|list', true],
		['list', 'list', true],
		['list<>', 'list', true],
		['list<>', 'list<>', true],
		['list<num>', 'list', false],
		['list<num>', 'list<num>', true],
		['list<num>', 'list<string>', false],
		['list(minlen=0)', 'list', true],
		['list(minlen=3)', 'list(minlen=3)', true],
		['list(minlen=3)', 'list(minlen=4)', false],
		['string', 'string(minlen=0)', true],
		['string(minlen=3)', 'string(minlen=3)', true],
		['string(minlen=3)', 'string(minlen=4)', false],
	];
	cases.forEach(function(caseInfo, index) {
		const val1 = new DataTypes(caseInfo[0]);
		const val2 = new DataTypes(caseInfo[1]);
		if (val1.equals(val2) !== caseInfo[2]) {
			const prefix = `Case ${index} `;
			logger(prefix +
			`Expected ${caseInfo[2]} but got ${val1.equals(val2)} for new DataTypes(${val1.toString()}).equals(${val2.toString()})`);
		}
	});
}

export function testDataTypes(logger) {
	wrapAndCall([
		testAllTypes,
		testEquals,
		testGetTypesCompatibleWithValue,
		testMayBeCompatibleWith,
		testParseAndCreateFromName
	], logger);
};