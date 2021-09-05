import { fetchJson } from '../modules/fetchJson.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
const commandsData = await fetchJson('json/commands.json');

export function testCommandsJSONExtraArgsInfo(logger) {
	commandsData.forEach(function(info, index) {
		const plogger = prefixWrapper(`Case ${index}, primaryName = ${info.primaryName}`, logger);
		if (info.argCount !== undefined && info.argCount.max === undefined) {
			if (info.extraArgsInfo === undefined) {
				plogger(`If argCount is specified without a max, extraArgsInfo should be specified.`);
			}
		}

		if (info.extraArgsInfo !== undefined) {
			const extraArgsInfo = info.extraArgsInfo;
			if (typeof extraArgsInfo !== 'object')
				plogger(`extraArgsInfo must either be undefined or be an object but got ${extraArgsInfo}`);
			else {
				if (typeof extraArgsInfo.types !== 'string')
					plogger(`Expected extraArgsInfo.types to be a string but got ${extraArgsInfo.types}`);
			}
		}
	});
};