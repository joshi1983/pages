import { validateNoParameterMustOutputProcedure } from './validateNoParameterMustOutputProcedure.js';

export function validateAnimationSnapshotStyleProcedure(cachedParseTree, parseLogger) {
	const proc = cachedParseTree.getProceduresMap().get('animation.snapshotstyle');
	if (proc !== undefined) {
		validateNoParameterMustOutputProcedure(proc, parseLogger, 'snapshot render settings');
	}
};