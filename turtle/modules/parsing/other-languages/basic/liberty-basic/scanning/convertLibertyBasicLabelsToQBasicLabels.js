import { convertSquareBracketExpressionToQBasicLabel } from
'../../bazz-basic/scanning/convertSpecificAnnotationsToLabels.js';
import { mightBeLabelName } from
'./mightBeLabelName.js';

function isOfInterest(tokens, i) {
	const token = tokens[i];
	if (token.s !== '[')
		return false;
	
	const closingBracket = tokens[i + 2];
	if (closingBracket === undefined || closingBracket.s !== ']')
		return false;

	const next = tokens[i + 1];
	if (!mightBeLabelName(next.s))
		return false;

	return true;
}

function isLabelDeclaration(tokens, i) {
	const token = tokens[i];
	const prev = tokens[i - 1];
	if (prev !== undefined &&
	prev.lineIndex === token.lineIndex) {
		// for example, goto [x]
		return false;
	}
	return true;
}

export function convertLibertyBasicLabelsToQBasicLabels(tokens) {
	for (let i = 0; i < tokens.length - 2; i++) {
		if (isOfInterest(tokens, i)) {
			if (isLabelDeclaration(tokens, i)) {
				// for example, convert [x] to x:
				convertSquareBracketExpressionToQBasicLabel(tokens, i);
			}
			else {
				// for example, convert goto [x] to goto x
				const labelNameToken = tokens[i + 1];
				tokens.splice(i, 3, labelNameToken);
			}
		}
	}
};