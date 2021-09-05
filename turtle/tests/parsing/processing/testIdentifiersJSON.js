import { Command } from
'../../../modules/parsing/Command.js';
import { fetchJson } from
'../../../modules/fetchJson.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
const identifiersData = await fetchJson('json/logo-migrations/processing/identifiers.json');
await Command.asyncInit();

export function testIdentifiersJSON(logger) {
	if (!(identifiersData instanceof Array))
		logger(`identifiers.json should format an Array but got ${identifiersData}`);
	else {
		identifiersData.forEach(function(identifierData, index) {
			if (typeof identifierData !== 'object') {
				logger(`Every element in the identifiers.json array must be an object but got ${identifierData} at index ${index}`);
				return;
			}
			const plogger = prefixWrapper(`Case ${index}, name=${identifierData.name}`, logger);
			if (identifierData.isProperty !== undefined &&
			typeof identifierData.isProperty !== 'boolean')
				plogger(`isProperty must be boolean if it is specified but got ${identifierData.isProperty}`);
			if (typeof identifierData.name !== 'string')
				plogger(`name must be a string but got ${identifierData.name}`);
			if (identifierData.toInline !== undefined) {
				if (typeof identifierData.toInline !== 'string')
					plogger(`toInline must either be undefined or be a string but got ${identifierData.toInline}`);
				if (identifierData.to !== undefined)
					plogger(`When toInline is specified, to should not be.`);
			}
			else if (identifierData.to !== undefined) {
				if (typeof identifierData.to !== 'string')
					plogger(`to must either not be specified or be a string but got ${identifierData.to}`);
				else {
					const commandInfo = Command.getCommandInfo(identifierData.to);
					if (commandInfo === undefined)
						plogger(`Unable to find WebLogo command matching the name ${identifierData.to}`);
				}
			}
			if (index !== 0 && typeof identifierData.name === 'string' &&
			typeof identifiersData[index - 1] === 'object') {
				const prev = identifiersData[index - 1];
				if (typeof prev.name === 'string' && prev.name.localeCompare(identifierData.name) >= 0)
					plogger(`Out of order ${prev.name} and ${identifierData.name}`);
			}
		});
	}
};