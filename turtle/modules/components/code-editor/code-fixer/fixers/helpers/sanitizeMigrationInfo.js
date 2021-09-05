import { Command } from
'../../../../../parsing/Command.js';
import { getDescendentsOfType } from
'../../../../../parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { LogoParser } from
'../../../../../parsing/LogoParser.js';
import { ParseLogger } from
'../../../../../parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();
await LogoParser.asyncInit();

function mightBeIndependentlyUseful(token) {
	const info = Command.getCommandInfo(token.val);
	if (info !== undefined) {
		if (info.isIndependentlyUseful)
			return true;
		return false;
	}
	else
		return true;
}

function sanitizeRemoveWhenTopLevelInstruction(commandInfo) {
	if (commandInfo.migrateToCode !== undefined &&
	commandInfo.removeWhenTopLevelInstruction === undefined) {
		const parseLogger = new ParseLogger();
		const tree = LogoParser.getParseTree(commandInfo.migrateToCode, parseLogger);
		const tokens = getDescendentsOfType(tree, ParseTreeTokenType.PARAMETERIZED_GROUP);
		if (!tokens.some(mightBeIndependentlyUseful)) {
			commandInfo.removeWhenTopLevelInstruction = true;
		}
	}
}

/*
json/commands.json is maintained in a more strict format than the data in the
json/logo-migrations directory.  The format of Logo migrations is more
relaxed because there is a lot more data in there and maintaining each and 
every attribute would take longer than maintaining it with just completeness 
to pass some tests in tests/testLogoCodeMigrationsJSON.js.

This helps to fix some issues so modules/parsing/Command.js can be
used on commands from migration files.
*/
export function sanitizeMigrationInfo(info) {
	for (const commandInfo of info.commands) {
		if (commandInfo.names === undefined)
			commandInfo.names = [];
		const needsArgsInfo = (commandInfo.args === undefined && commandInfo.argCount === undefined);
		if (needsArgsInfo || commandInfo.returnTypes === undefined) {
			if (commandInfo.to !== undefined) {
				const info = Command.getCommandInfo(commandInfo.to);
				if (needsArgsInfo) {
					commandInfo.args = info.args;
					commandInfo.argCount = info.argCount;
				}
				if (commandInfo.returnTypes === undefined)
					commandInfo.returnTypes = info.returnTypes;
			}
		}
		sanitizeRemoveWhenTopLevelInstruction(commandInfo);
	}
	if (info.operators === undefined)
		info.operators = [];
};