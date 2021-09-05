import { genericGetApplicableLabelFromGoto } from
'../../../helpers/genericGetApplicableLabelFromGoto.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { SetUtils } from
'../../../../../SetUtils.js';

const doTypes = new Set([
	ParseTreeTokenType.DO,
	ParseTreeTokenType.DO_UNTIL,
	ParseTreeTokenType.DO_WHILE
]);

const loopTypes = new Set([
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.WHILE
]);
SetUtils.addAll(loopTypes, doTypes);

function isOfInterest(getApplicableLabelFromGoto) {
	return function(token) {
		const label = getApplicableLabelFromGoto(token);
		return label !== undefined;
	};
}

function extraChecks(label, token, labels) {
	if (label === undefined ||
	label.lineIndex < token.lineIndex)
		return;
	const prev = label.getPreviousSibling();
	if (prev === null ||
	!loopTypes.has(prev.type))
		return;
	let tok = token.parentNode;
	for (; tok !== null && tok !== prev; tok = tok.parentNode) {
	}
	if (tok === null)
		return; // the loop before the label must contain token.

	return label;
}

export function gotoToExitLoops(root) {
	const getApplicableLabelFromGoto = genericGetApplicableLabelFromGoto(root, extraChecks);
	const gotos = getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).
		filter(isOfInterest(getApplicableLabelFromGoto));
	gotos.forEach(function(gotoToken) {
		const label = getApplicableLabelFromGoto(gotoToken);
		const prev = label.getPreviousSibling();
		const gotoChild = gotoToken.children[0];
		gotoToken.val = 'EXIT';
		gotoToken.type = ParseTreeTokenType.EXIT;
		while (gotoToken.children.length > 1)
			gotoToken.children[1].remove();
		if (doTypes.has(prev.type)) {
			gotoChild.val = 'DO';
			gotoChild.type = ParseTreeTokenType.DO;
		}
		else if (prev.type === ParseTreeTokenType.FOR) {
			gotoChild.val = 'FOR';
			gotoChild.type = ParseTreeTokenType.FOR;			
		}
		else {
			gotoChild.val = 'WHILE';
			gotoChild.type = ParseTreeTokenType.WHILE;			
		}
	});
	return gotos.length !== 0;
};