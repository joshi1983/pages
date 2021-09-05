import { DataTypes } from '../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../helpers/escapeHTML.js';
import { fetchJson } from '../../modules/fetchJson.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
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
		if (typeof commandInfo !== 'object' || commandInfo === null)
			return; // Some other tests will report those problems.

		const plogger = prefixWrapper(`Command ${index}, primaryName=${commandInfo.primaryName}`, logger);
		try {
			let returnDataTypes;
			if (commandInfo.returnTypes !== null) {
				returnDataTypes = new DataTypes(commandInfo.returnTypes);
			}
			if (commandInfo.args instanceof Array) {
				commandInfo.args.forEach(function(argInfo) {
					new DataTypes(argInfo.types);
					if (argInfo.disableTypeEqualitySymbolIfTypes !== undefined)
						new DataTypes(argInfo.disableTypeEqualitySymbolIfTypes);

					if (typeof argInfo.sameAsOutputIfTypesEqual === 'string') {
						const types = new DataTypes(argInfo.sameAsOutputIfTypesEqual);
						if (commandInfo.returnTypes === null)
							plogger(`returnTypes null which doesn't include any of sameAsOutputIfTypesEqual ${argInfo.sameAsOutputIfTypesEqual}`);
						else {
							const intersection = DataTypes.intersect(returnDataTypes.types, types.types);
							if (intersection.size === 0) {
								plogger(`returnTypes ${commandInfo.returnTypes} doesn't include any of sameAsOutputIfTypesEqual ${argInfo.sameAsOutputIfTypesEqual}.  An intersection should exist.`);
							}
						}
					}
				});
			}
			if (typeof commandInfo.extraArgsInfo === 'object' && typeof commandInfo.extraArgsInfo.types === 'string') {
				new DataTypes(commandInfo.extraArgsInfo.types);
			}
		}
		catch (e) {
			plogger('Error processing data types for command with primaryName ' + commandInfo.primaryName + ' at index ' + index + ', message: ' + e);
		}
	});
}

export function testCommandsJSONDataTypes(logger) {
	wrapAndCall([
		testGeneral,
		testMixItemsDataTypesMatchMix
	], logger);
};