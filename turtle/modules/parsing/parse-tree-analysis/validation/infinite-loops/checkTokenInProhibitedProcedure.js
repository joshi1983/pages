import { getProcedureStartToken } from '../../getProcedureStartToken.js';

const procNamesWithNoInfiniteLoops = new Set(['animation.setup', 'animation.snapshotstyle']);

export function checkTokenInProhibitedProcedure(token, parseLogger) {
	const procToken = getProcedureStartToken(token);
	if (procToken === undefined || procToken.children.length === 0)
		return false;
	const procChild = procToken.children[0];
	if (procChild !== undefined && typeof procChild.val === 'string') {
		const procName = procChild.val.toLowerCase();
		if (procNamesWithNoInfiniteLoops.has(procName)) {
			parseLogger.error('Infinite loops are not allowed in procedure ' + procName, token);
		}
	}
};