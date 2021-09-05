import { DataTypes } from '../modules/parsing/data-types/DataTypes.js';
import { fetchJson } from '../modules/fetchJson.js';
const commands = await fetchJson('json/commands.json');

export function testCommandsJSONDataTypes(logger) {
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
};