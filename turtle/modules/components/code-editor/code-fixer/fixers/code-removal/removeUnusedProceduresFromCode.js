import { getUncalledProceduresFromCode } from './getUncalledProceduresFromCode.js'
import { StringBuffer } from '../../../../../StringBuffer.js';

export function removeUnusedProceduresFromCode(code) {
	const intervalsToRemove = getUncalledProceduresFromCode(code);
	if (intervalsToRemove.length === 0)
		return code; // nothing to do.  Nothing to remove.

	const lines = code.split('\n');
	const result = new StringBuffer();
	let intervalIndex = 0;
	let interval = intervalsToRemove[intervalIndex];
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (interval === undefined || i < interval.from)
			result.append(line + '\n');
		else if (i < interval.to) {
			// Nothing to do right now.
			// Don't append the line.
			// The current line is in a procedure that must be removed.
		}
		else {
			interval = intervalsToRemove[++intervalIndex];
		}
	}
	return result.toString().trim();
};