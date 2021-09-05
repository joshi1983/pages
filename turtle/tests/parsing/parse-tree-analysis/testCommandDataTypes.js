import { Command } from '../../../modules/parsing/Command.js';
import { CommandDataTypes } from
'../../../modules/parsing/parse-tree-analysis/CommandDataTypes.js';
import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

// We need to await Command and DataTypes because CommandDataTypes depends on them.
await Command.asyncInit();
await DataTypes.asyncInit();

function testMixCommandParameterTypes(logger) {
	const cases = [
	{'paramTypes': ['num', 'transparent', 'num'], 
		'results': [
			'alphacolor',
			'alphacolor|num|transparent',
			'num(finite,max=1,min=0)'
		]},
	{
		'paramTypes': ['colorlist', 'alphacolor', 'num'], 'results': [
			'alphacolor',
			'alphacolor|transparent',
			'num(finite,max=1,min=0)'
		]
	},
	{
		'paramTypes': ['list<int>', 'list<int>', 'num'], 'results': [
			'alphacolor|list<alphacolor|num>',
			'alphacolor|list<alphacolor|num|transparent>|transparent',
			'num(finite,max=1,min=0)'
		]
	},
	{
		'paramTypes': ['list<int(max=5,min=5)>', 'list<int>', 'num'], 'results': [
			'alphacolor|list<alphacolor|num>',
			'alphacolor|list<alphacolor|num|transparent>|transparent',
			'num(finite,max=1,min=0)'
		]
	},
	{
		'paramTypes': ['color', 'list', 'num'], 'results': [
			'alphacolor|list<alphacolor|list|num>',
			'alphacolor|transparent',
			'num(finite,max=1,min=0)'
		]
	},
	{
		'paramTypes': ['list', 'list', 'num'], 'results': [
			'alphacolor|list<alphacolor|list|num>',
			'alphacolor|list<alphacolor|list|num|transparent>|transparent',
			'num(finite,max=1,min=0)'
		]
	},
	{
		'paramTypes': ['int', 'num', 'num'], 'results': [
			'alphacolor|num',
			'alphacolor|num|transparent',
			'num(finite,max=1,min=0)'
		]
	},
	{
		'paramTypes': ['int', 'num|transparent', 'num'], 'results': [
			'alphacolor|num',
			'alphacolor|num|transparent',
			'num(finite,max=1,min=0)'
		]
	},
	{
		'paramTypes': ['num', 'int', 'num'], 'results': [
			'alphacolor|num',
			'alphacolor|num|transparent',
			'num(finite,max=1,min=0)'
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
		testMixCommandParameterTypes
	], logger);
};