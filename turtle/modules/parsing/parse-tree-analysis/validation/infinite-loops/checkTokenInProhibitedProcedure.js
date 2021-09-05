import { getProcedureStartToken } from '../../getProcedureStartToken.js';

const procNamesWithNoInfiniteLoops = new Set(['animation.setup', 'animation.snapshotstyle']);

export function checkTokenInProhibitedProcedure(token, parseLogger) {
	const procToken = getProcedureStartToken(token);
	if (procToken === undefined || procToken.children.length === 0)
		return false;
	const procName = procToken.children[0].val.toLowerCase();
	if (procNamesWithNoInfiniteLoops.has(procName)) {
		parseLogger.error('Infinite loops are not allowed in procedure ' + procName, token);
	}
};