import { removeStopCallsAndParameters } from './removeStopCallsAndParameters.js';

export function animationSnapshotStyleFixer(cachedParseTree, fixLogger, proceduresMap) {
	const proc = cachedParseTree.getProceduresMap().get('animation.snapshotstyle');
	if (proc !== undefined) {
		removeStopCallsAndParameters(proc, fixLogger, cachedParseTree);
	}
};

