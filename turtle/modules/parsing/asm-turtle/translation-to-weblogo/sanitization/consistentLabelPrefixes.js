import { getDescendentsOfTypes } from
'../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function removeAllAtSigns(val) {
	return val.replaceAll('@', '');
}

function sanitizeLabelVal(val) {
	return '@' + removeAllAtSigns(val);
}

function sanitizeLabelAnchorVal(val) {
	return '@@' + removeAllAtSigns(val);
}

export function consistentLabelPrefixes(root) {
	const labels = getDescendentsOfTypes(root, [ParseTreeTokenType.LABEL, ParseTreeTokenType.LABEL_ANCHOR]);
	for (const label of labels) {
		if (label.type === ParseTreeTokenType.LABEL) {
			label.val = sanitizeLabelVal(label.val);
		}
		else {
			label.val = sanitizeLabelAnchorVal(label.val);
		}
	}
};