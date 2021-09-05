import { Command } from
'../../../../modules/parsing/Command.js';
import { fetchJson } from
'../../../../modules/fetchJson.js';
import { directReplacements } from
'../../../../modules/command-groups/MathCommands.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

await Command.asyncInit();
const data = await fetchJson('json/JavaScript/webLogoToJavaScript.json');

function isAlwaysTaking1Arg(webLogoCommandInfo) {
	const argCount = Command.getArgCount(webLogoCommandInfo);
	if (argCount.min !== undefined && argCount.min !== 1)
		return false;
	if (argCount.max !== undefined && argCount.max !== 1)
		return false;
	return true;
}

export function testWebLogoToJavaScriptJSON(logger) {
	if (typeof data !== 'object')
		logger(`webLogoToJavaScript.json should parse as an object but found ${data}`);
	else {
		if (!(data.commands instanceof Array))
			logger(`commands must be an Array but found ${data.commands}`);
		else {
			const names = new Set();
			data.commands.forEach(function(commandInfo, index) {
				if (typeof commandInfo !== 'object')
					logger(`Failed to find an object at commands index ${index}`);
				else {
					const plogger = prefixWrapper(`Command ${commandInfo.primaryName} at index ${index}`, logger);
					if (typeof commandInfo.primaryName !== 'string')
						plogger(`Expected primaryName to be a string`);
					else {
						names.add(commandInfo.primaryName);
						const webLogoCommandInfo = Command.getCommandInfo(commandInfo.primaryName);
						if (webLogoCommandInfo === undefined)
							plogger(`Unable to find a matching WebLogo command`);
						else if (webLogoCommandInfo.primaryName !== commandInfo.primaryName) {
							plogger(`The matched command doesn't have exactly the same primaryName.  The JavaScript migration primaryName is "${webLogoCommandInfo.primaryName}" != "${commandInfo.primaryName}"`);
						}
						else if (commandInfo.toUnaryOperator !== undefined && !isAlwaysTaking1Arg(webLogoCommandInfo))
							plogger(`When toUnaryOperator is specified, the corresponding WebLogo command should use exactly 1 argument.  This is not true for the command.`);

						const prev = data.commands[index - 1];
						if (typeof prev === 'object' && typeof prev.primaryName === 'string') {
							if (prev.primaryName.localeCompare(commandInfo.primaryName) > 0)
								plogger(`Out of order ${prev.primaryName} and ${commandInfo.primaryName}`);
						}
					}
					if (commandInfo.names !== undefined)
						plogger(`names should not be specified here.  You can have it in json/commands.json but it only adds confusion to set it in json/JavaScript/webLogoToJavaScript.json`);

					const optionalStringKeys = ['after', 'migrateToCode', 'to', 'toOperator', 'toUnaryOperator'];
					for (const key of optionalStringKeys) {
						const val = commandInfo[key];
						if (val !== undefined && typeof val !== 'string')
							plogger(`${key} must either be undefined or a string but found ${val}`);
					}
				}
			});
			for (const directReplacement of directReplacements.keys()) {
				const info = Command.getCommandInfo(directReplacement);
				if (info !== undefined) {
					const plogger = prefixWrapper(`Command ${info.primaryName}`, logger);
					if (!names.has(info.primaryName)) {
						plogger(`Unable to find migration info for primaryName ${info.primaryName}.  ` +
						`The command is mentioned in directReplacements MathCommands which means a highly readable and efficient translation to JavaScript should be available.`);
					}
					else {
						for (const commandInfo of data.commands) {
							const info2 = Command.getCommandInfo(commandInfo.primaryName);
							if (info2 === info && commandInfo.to === undefined) {
								plogger(`to should be set to something like ${directReplacements.get(directReplacement)}`);
							}
						}
					}
				}
			}
		}
	}
};