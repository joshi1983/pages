import { DataTypes } from '../modules/parsing/data-types/DataTypes.js';
import { fetchJson } from '../modules/fetchJson.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
const commands = await fetchJson('json/commands.json');

/*
Checking this in case these commands ever get updated with different return types or argument data types.
*/
function testMixItemsDataTypesMatchMix(logger) {
	const mixItemsInfo = commands.filter(info => info.primaryName === 'mixItems')[0];
	const mixInfo = commands.filter(info => info.primaryName === 'mix')[0];
	if (mixInfo.returnTypes !== mixItemsInfo.returnTypes)
		logger(`Expected mixItems and mix to return the same types since mixItems returns the result of mix. ${mixInfo.returnTypes} != ${mixItemsInfo.returnTypes}`);
	else {
		const argInfo = mixItemsInfo.args[0];
		if (argInfo.listElementTypes !== mixInfo.args[1].types)
			logger(`Expected mixItems first argument elementTypes to match types from args[1] of mix command.  ${argInfo.listElementTypes} != ${mixInfo.args[1].types}`);
	}
}

function testGeneral(logger) {
	commands.forEach(function(commandInfo, index) {
		try {
			if (commandInfo.args instanceof Array) {
				commandInfo.args.forEach(function(argInfo) {
					new DataTypes(argInfo.types);
					if (argInfo.disableTypeEqualitySymbolIfTypes !== undefined)
						new DataTypes(argInfo.disableTypeEqualitySymbolIfTypes);
				});
			}
			if (commandInfo.returnTypes !== null) {
				new DataTypes(commandInfo.returnTypes);
			}
		}
		catch (e) {
			logger('Error processing data types for command with primaryName ' + commandInfo.primaryName + ' at index ' + index + ', message: ' + e);
		}
	});
}

export function testCommandsJSONDataTypes(logger) {
	testGeneral(prefixWrapper('testGeneral', logger));
	testMixItemsDataTypesMatchMix(prefixWrapper('testMixItemsDataTypesMatchMix', logger));
};