import { Command } from
'../../../../../../modules/parsing/Command.js';
import { variableNotMutatedCommandNames } from
'../../../../../../modules/parsing/parse-tree-analysis/variable-data-types/token-evaluation/token-equalities/forgetVariablesChangedInToken.js';
await Command.asyncInit();

export function testForgetVariablesChangedInToken(logger) {
	for (const name of variableNotMutatedCommandNames) {
		const info = Command.getCommandInfo(name);
		if (info === undefined)
			logger(`Unable to find Command information for name ${name}`);
		else if (info.primaryName !== name)
			logger(`primaryName(${info.primaryName}) should exactly match name ${name}.  It does not.`);
	}
};