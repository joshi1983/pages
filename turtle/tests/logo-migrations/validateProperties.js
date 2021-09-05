import { Command } from '../../modules/parsing/Command.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
await Command.asyncInit();

function validateGetSet(key, getSetInfo, logger) {
	if (typeof getSetInfo !== 'object' || getSetInfo === null) {
		logger(`Expected ${key} to either be undefined or an object but got ${getSetInfo}`);
	}
	else {
		if (getSetInfo.toCommand !== undefined) {
			if (typeof getSetInfo.toCommand !== 'string')
				logger(`Expected toCommand to either be undefined or a string but got ${getSetInfo.toCommand}`);
			else {
				const info = Command.getCommandInfo(getSetInfo.toCommand);
				if (info === undefined)
					logger(`Unable to find WebLogo command info matching the toCommand ${getSetInfo.toCommand}`);
				else {
					if (key === 'get') {
						if (info.args.length !== 0)
							logger(`Expected get's toCommand to be a command with no arguments but found args.length of ${info.args.length}`);
					}
					else if (key === 'set') {
						if (info.args.length !== 1)
							logger(`Expected get's toCommand to be a command with 1 argument but found args.length of ${info.args.length}`);
					}
				}
			}
		}
	}
}

function validateProperty(propInfo, logger) {
	if (typeof propInfo !== 'object' || propInfo === null) {
		logger(`Expected propInfo to be an object but got ${typeof propInfo}`);
		return;
	}
	if (typeof propInfo.name !== 'string')
		logger(`Expected name to be a string but got ${propInfo.name}`);
	const optionalStringKeys = ['externalLink', 'ofClassName'];
	for (const optionalStringKey of optionalStringKeys) {
		if (propInfo[optionalStringKey] !== undefined && typeof propInfo[optionalStringKey] !== 'string')
			logger(`Expected propInfo.${optionalStringKey} to either be undefined or a string but got ${typeof propInfo[optionalStringKey]}`);
	}
	if (propInfo.get !== undefined) {
		validateGetSet('get', propInfo.get, logger);
	}
	if (propInfo.set !== undefined) {
		validateGetSet('set', propInfo.set, logger);
	}
}

export function validateProperties(fullInfoObject, logger) {
	if (fullInfoObject.properties === undefined)
		return;
	if (!(fullInfoObject.properties instanceof Array)) {
		logger(`properties expected to be an Array but got ${fullInfoObject.properties}`);
		return;
	}
	fullInfoObject.properties.forEach(function(propInfo, index) {
		const plogger = prefixWrapper(`Property ${index} with name ${propInfo.name}`, logger);
		const prevName = index === 0 || (typeof fullInfoObject.properties[index - 1] !== 'object') ? 
			undefined : fullInfoObject.properties[index - 1].name;
		if (typeof propInfo.name === 'string' &&
		typeof prevName === 'string' && propInfo.name.localeCompare(prevName) < 0)
			plogger(`properties are expected to be ordered by name. ${propInfo.name} is out of order with ${prevName}.`);
		validateProperty(propInfo, plogger);
	});
};