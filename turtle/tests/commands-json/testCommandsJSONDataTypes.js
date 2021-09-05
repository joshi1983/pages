import { DataTypes } from '../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../helpers/escapeHTML.js';
import { fetchJson } from '../../modules/fetchJson.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';
const commands = await fetchJson('json/commands.json');
await DataTypes.asyncInit();

/*
Checking this in case these commands ever get updated with different return types or argument data types.
*/
function testMixItemsDataTypesMatchMix(logger) {
	const mixItemsInfo = commands.filter(info => info.primaryName === 'mixItems')[0];
	const mixInfo = commands.filter(info => info.primaryName === 'mix')[0];
	if (mixInfo.returnTypes !== mixItemsInfo.returnTypes)
		logger(escapeHTML(`Expected mixItems and mix to return the same types since mixItems returns the result of mix. ${mixInfo.returnTypes} != ${mixItemsInfo.returnTypes}`));
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
			if (typeof commandInfo.extraArgsInfo === 'object' && typeof commandInfo.extraArgsInfo.types === 'string') {
				new DataTypes(commandInfo.extraArgsInfo.types);
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
	wrapAndCall([
		testGeneral,
		testMixItemsDataTypesMatchMix
	], logger);
};