import { Command } from
'../../../modules/parsing/Command.js';
import { fetchJson } from
'../../../modules/fetchJson.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';

const data = await fetchJson('json/logo-migrations/kojo/migration.json');

function validateFunctions(funcs, logger) {
	if (!(funcs instanceof Array))
		logger(`Expected functions to be an Array but found ${funcs}`);
	else {
		funcs.forEach(function(funcInfo, index) {
			if ((typeof funcInfo !== 'object') || funcInfo === null)
				logger(`Every element of functions must be an object but found ${funcInfo} at index ${index}`);
			else {
				const flogger = prefixWrapper(`Function ${index}, name=${funcInfo.name}`, logger);
				if (typeof funcInfo.name !== 'string')
					flogger(`name must be a string but found ${funcInfo.name}`);
				else {
					if (index !== 0) {
						const prev = funcs[index - 1];
						if (typeof prev === 'object' && prev !== null && typeof prev.name === 'string') {
							if (prev.name.localeCompare(funcInfo.name) >= 0)
								flogger(`The functions should be sorted alphabetically by name but found a pair out of order:  ${prev.name} and ${funcInfo.name}`);
						}
					}
				}
				if (funcInfo.to !== undefined) {
					if (typeof funcInfo.to !== 'string')
						flogger(`to must either be a string or be undefined but found ${funcInfo.to}`);
					else {
						const commandInfo = Command.getCommandInfo(funcInfo.to);
						if (commandInfo === undefined)
							flogger(`Unable to find a WebLogo command corresponding with the "to" value: ${funcInfo.to}`);
					}
				}
			}
		});
	}
}

export function testMigrationJson(logger) {
	if (typeof data !== 'object')
		logger(`Expected data to be an object but found ${data}`);
	else {
		validateFunctions(data.functions, prefixWrapper(`Checking functions`, logger));
	}
};