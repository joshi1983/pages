import { Command } from
'../../../../../../modules/parsing/Command.js';
import { checkers, endingNames } from
'../../../../../../modules/parsing/parse-tree-analysis/variable-data-types/token-evaluation/token-equalities/isDefinitelyEndingTheInstructionList.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

await Command.asyncInit();

function checkName(name, logger) {
	const info = Command.getCommandInfo(name);
	if (info === undefined)
		logger(`Unable to find command information for name ${name}`);
	else if (info.primaryName !== name)
		logger(`Command information has a primaryName(${info.primaryName}) that does not exactly match name ${name}`);
}

function testEndingCommandsMatchPrimaryNames(logger) {
	for (const name of endingNames) {
		checkName(name, logger);
	}
}

function testCheckersMatchPrimaryNames(logger) {
	for (const name of checkers.keys()) {
		checkName(name, logger);
	}
}

export function testIsDefinitelyEndingTheInstructionList(logger) {
	wrapAndCall([
		testEndingCommandsMatchPrimaryNames,
		testCheckersMatchPrimaryNames
	], logger);
};