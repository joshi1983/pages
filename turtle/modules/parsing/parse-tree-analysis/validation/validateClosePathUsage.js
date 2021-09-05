import { pathCommandNames, pathCommandNamesStr } from '../pathCommandNames.js';

export function validateClosePathUsage(cachedParseTree, parseLogger) {
	const closePathCalls = cachedParseTree.getCommandCallsByName('closePath');
	if (closePathCalls.length !== 0) {
		const pathCommandCalls = cachedParseTree.getCommandCallsByNames(pathCommandNames);
		if (pathCommandCalls.length === 0) {
			closePathCalls.forEach(function(closePathCallToken) {
				parseLogger.error('closePath will not work since this program never calls a path-related command.  Path-related commands include '
					+ pathCommandNamesStr, closePathCallToken);
			});
		}
	}
};