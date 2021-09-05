import { declarationTypes } from
'./isCompleteWithNext.js';
import { SetUtils } from '../../../../../SetUtils.js';

const appendChildPrevTypes = new Set();
SetUtils.addAll(appendChildPrevTypes, declarationTypes);

function shouldAppendChildNext(prev) {
	if (appendChildPrevTypes.has(prev.type))
		return true;

	return prev.parentNode === null;
}

export function processAssignmentOperator(prev, next) {
	const prevParent = prev.parentNode;
	if (shouldAppendChildNext(prev)) {
		prev.appendChild(next);
	}
	else {
		prev.remove();
		next.appendChild(prev);
		prevParent.appendChild(next);
	}
	return next;
};