import { CommandDataTypes } from '../../../modules/parsing/parse-tree-analysis/CommandDataTypes.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

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
			'result': 'list'
		},
		{
			'command': 'butFirst',
			'in': ['alphacolorlist'],
			'result': 'list'
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
			plogger(`Expected "${caseInfo.result}" but got "${result}"`);
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
			'alphacolor',
			'num'
		]
	},
	{
		'paramTypes': ['color', 'list', 'num'], 'results': [
			'list',
			'alphacolor',
			'num'
		]
	},
	{
		'paramTypes': ['list', 'list', 'num'], 'results': [
			'list',
			'list',
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