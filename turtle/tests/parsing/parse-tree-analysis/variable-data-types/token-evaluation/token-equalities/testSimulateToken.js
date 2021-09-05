import { Command } from
'../../../../../../modules/parsing/Command.js';
import { processors } from
'../../../../../../modules/parsing/parse-tree-analysis/variable-data-types/token-evaluation/token-equalities/simulateToken.js';

await Command.asyncInit();

export function testSimulateToken(logger) {
	for (const key of processors.keys()) {
		const info = Command.getCommandInfo(key);
		if (info === undefined)
			logger(`Unable to find command information for name ${key}`);
		else if (info.primaryName !== key)
			logger(`Command primaryName for ${key} is not exactly equal.  primaryName=${info.primaryName}`);			
	}
};