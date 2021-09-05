import { Command } from
'../../../modules/parsing/Command.js';
import { fetchJson } from
'../../../modules/fetchJson.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';

const data = await fetchJson('json/logo-migrations/kojo/migration.json');

function validateConstantOrFunctionBasics(a, logger) {
	if (!(a instanceof Array))
		logger(`Expected functions to be an Array but found ${a}`);
	else {
		a.forEach(function(info, index) {
			if ((typeof info !== 'object') || info === null)
				logger(`Every element must be an object but found ${info} at index ${index}`);
			else {
				const flogger = prefixWrapper(`Element ${index}, name=${info.name}`, logger);
				if (typeof info.name !== 'string')
					flogger(`name must be a string but found ${info.name}`);
				else {
					if (index !== 0) {
						const prev = a[index - 1];
						if (typeof prev === 'object' && prev !== null && typeof prev.name === 'string') {
							if (prev.name.localeCompare(info.name) > 0)
								flogger(`This should be sorted alphabetically by name but found a pair out of order:  ${prev.name} and ${info.name}`);
						}
					}
				}
				if (info.to !== undefined) {
					if (typeof info.to !== 'string')
						flogger(`to must either be a string or be undefined but found ${info.to}`);
					else {
						const commandInfo = Command.getCommandInfo(info.to);
						if (commandInfo === undefined)
							flogger(`Unable to find a WebLogo command corresponding with the "to" value: ${info.to}`);
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
		validateConstantOrFunctionBasics(data.functions, prefixWrapper(`Checking functions`, logger));
		validateConstantOrFunctionBasics(data.properties, prefixWrapper('properties', logger));
		if (data.properties instanceof Array) {
			data.properties.forEach(function(info, index) {
				const plogger = prefixWrapper(`property index ${index}, name=${info.name}`, logger);
				// Some keys are used in functions but we don't want them for properties.
				// If they're on properties, the person making the data likely got confused.
				const unexpectedKeys = ['args', 'argCount'];
				for (const key of unexpectedKeys) {
					if (info[key] !== undefined)
						plogger(`${key} should not be specified for properties.`);
				}
			});
		}
	}
};