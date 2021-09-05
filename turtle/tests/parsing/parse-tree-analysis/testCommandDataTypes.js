import { Command } from '../../../modules/parsing/Command.js';
import { CommandDataTypes } from '../../../modules/parsing/parse-tree-analysis/CommandDataTypes.js';
import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

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
			'in': ['list(minlen=3)'],
			'result': 'list(minlen=2)'
		},
		{
			'command': 'butFirst',
			'in': ['list(minlen=1)'],
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
			'command': 'clone',
			'in': ['list'],
			'result': 'list'
		},
		{
			'command': 'clone',
			'in': ['list<int>'],
			'result': 'list<int>'
		},
		{
			'command': 'clone',
			'in': ['plist'],
			'result': 'plist'
		},
		{
			'command': 'duplicate',
			'in': ['int', 'int'],
			'result': 'list<int>'
		},
		{
			'command': 'duplicate',
			'in': ['num', 'int'],
			'result': 'list<num>'
		},
		{
			'command': 'duplicate',
			'in': ['alphacolor|transparent', 'int'],
			'result': 'list<alphacolor|transparent>'
		},
		{
			'command': 'filter',
			'in': ['cproc:1(returntypes=bool)', 'list<int>'],
			'result': 'list<int>'
		},
		{
			'command': 'filter',
			'in': ['cproc:1(returntypes=bool)', 'list<num>'],
			'result': 'list<num>'
		},
		{
			'command': 'filter',
			'in': ['cproc:1(returntypes=bool)', 'list<string>'],
			'result': 'list<string>'
		},
		{
			'command': 'first',
			'in': ['int', 'list'],
			'result': '*'
		},
		{
			'command': 'first',
			'in': ['int', 'string'],
			'result': 'string(minlen=1)'
		},
		{
			'command': 'first',
			'in': ['int', 'list<num>'],
			'result': 'num'
		},
		{
			'command': 'firsts',
			'in': ['list<list>'],
			'result': 'list'
		},
		{
			'command': 'firsts',
			'in': ['list<list<num>>'],
			'result': 'list<num>'
		},
		{
			'command': 'firsts',
			'in': ['list<num|list<num>>'],
			'result': 'list<num>'
		},
		{
			'command': 'firsts',
			'in': ['list<list<num|string>>'],
			'result': 'list<num|string>'
		},
		{
			'command': 'firsts',
			'in': ['list<list<string>>'],
			'result': 'list<string>'
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
			'command': 'ifelse',
			'in': ['bool', 'list<colorstring>', 'list<colorstring>'],
			'result': 'list<colorstring>'
		},
		{
			'command': 'item',
			'in': ['int', 'list'],
			'result': '*'
		},
		{
			'command': 'item',
			'in': ['int', 'string'],
			'result': 'string(minlen=1)'
		},
		{
			'command': 'item',
			'in': ['int', 'list<num>'],
			'result': 'num'
		},
		{
			'command': 'item',
			'in': ['int', 'colorlist'],
			'result': 'num'
		},
		{
			'command': 'item',
			'in': ['int', 'alphacolorlist'],
			'result': 'num'
		},
		{
			'command': 'item',
			'in': ['int', 'list<list<num>>'],
			'result': 'list<num>'
		},
		{
			'command': 'item',
			'in': ['int', 'colorlist|list<list<num>>'],
			'result': 'list<num>|num'
		},
		{
			'command': 'item',
			'in': ['int', 'alphacolorlist|list<list<num>>'],
			'result': 'list<num>|num'
		},
		{
			'command': 'item',
			'in': ['int', 'list<num|string>'],
			'result': 'num|string'
		},
		{
			'command': 'last',
			'in': ['int', 'string'],
			'result': 'string(minlen=1)'
		},
		{
			'command': 'last',
			'in': ['int', 'list<num>'],
			'result': 'num'
		},
		{
			'command': 'last',
			'in': ['int', 'list<string>'],
			'result': 'string'
		},
		{
			'command': 'last',
			'in': ['int', 'string'],
			'result': 'string(minlen=1)'
		},
		{
			'command': 'last',
			'in': ['int', 'list<list>'],
			'result': 'list'
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
			'in': ['list<num>', 'list<num>', 'num'],
			'result': 'list<num>'
		},
		{
			'command': 'mix',
			'in': ['list<int>', 'list<num>', 'num'],
			'result': 'list<num>'
		},
		{
			'command': 'mix',
			'in': ['list<num>', 'list<int>', 'num'],
			'result': 'list<num>'
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
		},
		{
			'command': 'remove',
			'in': ['num', 'list<num>'],
			'result': 'list<num>'
		},
		{
			'command': 'remove',
			'in': ['string', 'list<string>'],
			'result': 'list<string>'
		},
		{
			'command': 'remove',
			'in': ['string', 'list<list|string>'],
			'result': 'list<list|string>'
		},
		{
			'command': 'remove',
			'in': ['string', 'list|string'],
			'result': 'list|string'
		},
		{
			'command': 'remove',
			'in': ['string', '*'],
			'result': 'list|string'
		},
		{
			'command': 'sort',
			'in': ['list<int>'],
			'result': 'list<int>'
		},
		{
			'command': 'sort',
			'in': ['list<num>'],
			'result': 'list<num>'
		},
		{
			'command': 'sort',
			'in': ['list<int|string>'],
			'result': 'list<int|string>'
		},
		{
			'command': 'sort',
			'in': ['list<num|string>'],
			'result': 'list<num|string>'
		},
		{
			'command': 'sort',
			'in': ['list<string>'],
			'result': 'list<string>'
		},
		{
			'command': 'sort',
			'in': ['list<list>', 'cproc:2'],
			'result': 'list<list>'
		},
		{
			'command': 'sort',
			'in': ['list<plist>', 'cproc:2'],
			'result': 'list<plist>'
		},
		{
			'command': 'sublist',
			'in': ['list<num>', 'int', 'int'],
			'result': 'list<num>'
		},
		{
			'command': 'sublist',
			'in': ['list<string>', 'int', 'int'],
			'result': 'list<string>'
		},
		{
			'command': 'sublist',
			'in': ['list<num|string>', 'int', 'int'],
			'result': 'list<num|string>'
		},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(escapeHTML(`Case ${index}, in: ${JSON.stringify(caseInfo.in)}`), logger);
		const info = Command.getCommandInfo(caseInfo.command);
		if (info === undefined)
			plogger(`Expected to find command info for primaryName: "${caseInfo.command}" but did not and was unable to continue testing this case`);
		else {
			const result = CommandDataTypes.getReturnDataTypesFromInputs(caseInfo.command, caseInfo.in);
			if (result !== caseInfo.result)
				plogger(escapeHTML(`Expected "${caseInfo.result}" but got "${result}"`));
		}
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
		'paramTypes': ['list<int>', 'list<int>', 'num'], 'results': [
			'alphacolor|list<alphacolor|num>',
			'alphacolor|list<alphacolor|num|transparent>|transparent',
			'num'
		]
	},
	{
		'paramTypes': ['color', 'list', 'num'], 'results': [
			'alphacolor|list<alphacolor|list|num>',
			'alphacolor|transparent',
			'num'
		]
	},
	{
		'paramTypes': ['list', 'list', 'num'], 'results': [
			'alphacolor|list<alphacolor|list|num>',
			'alphacolor|list<alphacolor|list|num|transparent>|transparent',
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
				plogger(escapeHTML(`Parameter ${paramIndex} expected to find types "${expectedTypes}" but got "${result}"`));
		});
	});
}

export function testCommandDataTypes(logger) {
	wrapAndCall([
		testCommandReturnTypes,
		testMixCommandParameterTypes
	], logger);
};