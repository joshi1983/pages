import { Command } from '../../../modules/parsing/Command.js';
import { CommandDataTypes } from '../../../modules/parsing/parse-tree-analysis/CommandDataTypes.js';
import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

// We need to await Command and DataTypes because CommandDataTypes depends on them.
await Command.asyncInit();
await DataTypes.asyncInit();

function testCommandReturnTypes(logger) {
	const cases = [
		{
			'command': 'abs',
			'in': ['int'],
			'result': 'int'
		},
		{
			'command': 'abs',
			'in': ['color'],
			'result': 'int'
		},
		{
			'command': 'abs',
			'in': ['num'],
			'result': 'num'
		},
		{
			'command': 'abs',
			'in': [undefined],
			'result': 'num'
		},
		{
			'command': 'abs',
			'in': ['null'],
			'result': 'num'
		},
		{
			'command': 'butFirst',
			'in': ['string'],
			'result': 'string'
		},
		{
			'command': 'butFirst',
			'in': ['list'],
			'result': 'list'
		},
		{
			'command': 'butFirst',
			'in': ['colorlist'],
			'result': 'list<num>'
		},
		{
			'command': 'butFirst',
			'in': ['alphacolorlist'],
			'result': 'list<num>'
		},
		{
			'command': 'butFirst',
			'in': ['alphacolorlist|string'],
			'result': 'list|string'
		},
		{
			'command': 'butFirst',
			'in': [undefined],
			'result': 'list|string'
		},
		{
			'command': 'butFirst',
			'in': ['list<num>'],
			'result': 'list<num>'
		},
		{
			'command': 'butFirst',
			'in': ['list<bool>'],
			'result': 'list<bool>'
		},
		{
			'command': 'butFirst',
			'in': ['list<string>'],
			'result': 'list<string>'
		},
		{
			'command': 'butFirst',
			'in': ['list<num|string>'],
			'result': 'list<num|string>'
		},
		{
			'command': 'butFirst',
			'in': ['colorlist|string'],
			'result': 'list<num>|string'
		},
		{
			'command': 'first',
			'in': ['int', 'list'],
			'result': '*'
		},
		{
			'command': 'first',
			'in': ['int', 'string'],
			'result': 'string'
		},
		{
			'command': 'first',
			'in': ['int', 'list<num>'],
			'result': 'num'
		},
		{
			'command': 'ifelse',
			'in': ['bool', 'num', 'int'],
			'result': 'num'
		},
		{
			'command': 'ifelse',
			'in': ['bool', 'string', 'string'],
			'result': 'string'
		},
		{
			'command': 'ifelse',
			'in': ['bool', 'list', 'string'],
			'result': 'list|string'
		},
		{
			'command': 'item',
			'in': ['int', 'list'],
			'result': '*'
		},
		{
			'command': 'item',
			'in': ['int', 'string'],
			'result': 'string'
		},
		{
			'command': 'item',
			'in': ['int', 'list<num>'],
			'result': 'num'
		},
		{
			'command': 'item',
			'in': ['int', 'list<num|string>'],
			'result': 'num|string'
		},
		{
			'command': 'mix',
			'in': ['num', 'alphacolor', 'num'],
			'result': 'alphacolorlist|num'
		},
		{
			'command': 'mix',
			'in': ['num', 'transparent', 'num'],
			'result': 'alphacolorlist'
		},
		{
			'command': 'mix',
			'in': ['num', 'alphacolorlist', 'num'],
			'result': 'alphacolorlist'
		},
		{
			'command': 'mix',
			'in': ['alphacolorlist', 'num', 'num'],
			'result': 'alphacolorlist'
		},
		{
			'command': 'mix',
			'in': ['colorstring', 'colorlist', 'num'],
			'result': 'colorlist'
		},
		{
			'command': 'mix',
			'in': ['num', 'string|transparent', 'num'],
			'result': 'alphacolorlist'
		},
		{
			'command': 'mix',
			'in': ['colorstring', 'colorstring', 'num'],
			'result': 'colorlist'
		},
		{
			'command': 'mix',
			'in': ['colorlist', 'colorstring', 'num'],
			'result': 'colorlist'
		},
		{
			'command': 'mix',
			'in': ['list', 'list', 'num'],
			'result': 'list'
		},
		{
			'command': 'mix',
			'in': ['list', 'transparent', 'num'],
			'result': 'alphacolorlist'
		},
		{
			'command': 'mix',
			'in': ['num', 'num', 'num'],
			'result': 'num'
		},
		{
			'command': 'mix',
			'in': ['int', 'int', 'num'],
			'result': 'num'
		},
		{
			'command': 'mix',
			'in': ['int', 'num', 'num'],
			'result': 'num'
		},
		{
			'command': 'mix',
			'in': ['num', 'int', 'num'],
			'result': 'num'
		},
		{
			'command': 'mix',
			'in': ['int', 'transparent', 'num'],
			'result': 'alphacolorlist'
		},
		{
			'command': 'mix',
			'in': ['colorstring', 'transparent', 'num'],
			'result': 'alphacolorlist'
		},
		{
			'command': 'mix',
			'in': ['alphacolorstring', 'transparent', 'num'],
			'result': 'alphacolorlist'
		},
		{
			'command': 'mix',
			'in': ['alphacolorlist', 'transparent', 'num'],
			'result': 'alphacolorlist'
		},
		{
			'command': 'mix',
			'in': ['alphacolor|list', 'int', 'num'],
			'result': 'alphacolorlist|num'
		},
		{
			'command': 'mix',
			'in': [undefined, undefined, 'num'],
			'result': 'list|num'
		},
		{
			'command': 'mix',
			'in': ['num', 'num', 'null'],
			'result': 'num'
		},
		{
			'command': 'power',
			'in': ['int', 'int'],
			'result': 'int'
		},
		{
			'command': 'power',
			'in': ['int', 'num'],
			'result': 'num'
		},
		{
			'command': 'power',
			'in': ['num', 'int'],
			'result': 'num'
		},
		{
			'command': 'power',
			'in': ['num', 'num'],
			'result': 'num'
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in: ${JSON.stringify(caseInfo.in)}`, logger);
		const result = CommandDataTypes.getReturnDataTypesFromInputs(caseInfo.command, caseInfo.in);
		if (result !== caseInfo.result)
			plogger(escapeHTML(`Expected "${caseInfo.result}" but got "${result}"`));
	});
}

function testMixCommandParameterTypes(logger) {
	const cases = [
	{'paramTypes': ['num', 'transparent', 'num'], 
		'results': [
			'alphacolor',
			'alphacolor|num|transparent',
			'num'
		]},
	{
		'paramTypes': ['colorlist', 'alphacolor', 'num'], 'results': [
			'alphacolor',
			'alphacolor|transparent',
			'num'
		]
	},
	{
		'paramTypes': ['color', 'list', 'num'], 'results': [
			'alphacolor|list',
			'alphacolor|transparent',
			'num'
		]
	},
	{
		'paramTypes': ['list', 'list', 'num'], 'results': [
			'alphacolor|list',
			'alphacolor|list|transparent',
			'num'
		]
	},
	{
		'paramTypes': ['int', 'num', 'num'], 'results': [
			'alphacolor|num',
			'alphacolor|num|transparent',
			'num'
		]
	},
	{
		'paramTypes': ['int', 'num|transparent', 'num'], 'results': [
			'alphacolor|num',
			'alphacolor|num|transparent',
			'num'
		]
	},
	{
		'paramTypes': ['num', 'int', 'num'], 'results': [
			'alphacolor|num',
			'alphacolor|num|transparent',
			'num'
		]
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if (caseInfo.results.length !== caseInfo.paramTypes.length) {
			plogger(`Expected results.length(${caseInfo.results.length}) to equal paramTypes.length(${caseInfo.paramTypes.length})`);
			return;
		}
		function getTypesForParameter(paramIndex) {
			return caseInfo.paramTypes[paramIndex];
		}
		caseInfo.results.forEach(function(expectedTypes, paramIndex) {
			const result = CommandDataTypes.getRequiredParameterTypes('mix', paramIndex, getTypesForParameter);
			if (result !== expectedTypes)
				plogger(`Parameter ${paramIndex} expected to find types "${expectedTypes}" but got "${result}"`);
		});
	});
}

export function testCommandDataTypes(logger) {
	testCommandReturnTypes(prefixWrapper('testCommandReturnTypes', logger));
	testMixCommandParameterTypes(prefixWrapper('testMixCommandParameterTypes', logger));
};