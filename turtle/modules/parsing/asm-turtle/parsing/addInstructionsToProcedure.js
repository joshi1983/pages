import { addChildrenUpTo } from
'../translation-to-weblogo/jump-conversion/addChildrenUpTo.js';
import { Instruction } from '../Instruction.js';
import { isAfterOrSame } from '../../generic-parsing-utilities/isAfterOrSame.js';
import { jumpToLabelName } from '../translation-to-weblogo/jump-conversion/jumpToLabelName.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function getEndProcedureToken(procStart, labelsMap) {
	const parent = procStart.parentNode;
	const children = parent.children;
	let index = children.indexOf(procStart) + 1;
	let lastLabelJumpedTo;
	let result;
	for (;index < children.length; index++) {
		const child = children[index];
		if (child.type === ParseTreeTokenType.PROC_START)
			return result;
		if (child.type === ParseTreeTokenType.INSTRUCTION) {
			if (lastLabelJumpedTo === undefined && child.val.toLowerCase() === 'ret')
				return child;
			const info = Instruction.getInstructionInfo(child.val);
			if (info !== undefined) {
				if (Instruction.isJumpOrCall(info) &&
				info.primaryName !== 'call') {
					const label = labelsMap.get(jumpToLabelName(child));
					if (isAfterOrSame(procStart, label))
						return;
					if (lastLabelJumpedTo === undefined || isAfterOrSame(label, lastLabelJumpedTo))
						lastLabelJumpedTo = label;
				}
			}
		}
		else if (lastLabelJumpedTo === child ||
		(lastLabelJumpedTo !== undefined && isAfterOrSame(child, lastLabelJumpedTo)))
			lastLabelJumpedTo = undefined;
		result = child;
	}
	return result;
}

export function addInstructionsToProcedure(procStart, labelsMap) {
	if (!(labelsMap instanceof Map))
		throw new Error(`labelsMap must be a Map but got ${labelsMap}`);
	const endToken = getEndProcedureToken(procStart, labelsMap);
	if (endToken !== undefined) {
		addChildrenUpTo(procStart, endToken);
		endToken.remove();
		procStart.appendChild(endToken);
	}
};