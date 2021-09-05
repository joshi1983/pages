import { CGJenningsProperties } from '../CGJenningsProperties.js';
import { convertToArrows } from
'../../helpers/convertToArrows.js';
import { insertAssignmentOperators } from
'../../helpers/insertAssignmentOperators.js';
import { scan as zeroLScan } from
'../../0L/scanning/scan.js';

function mightBeProperty(name) {
	return CGJenningsProperties.getPropertyInfo(name) !== undefined;
}

const tokenTranslators = [
	convertToArrows,
	insertAssignmentOperators(mightBeProperty)
];

export function scan(code) {
	const tokens = zeroLScan(code);
	for (const tokenTranslator of tokenTranslators) {
		tokenTranslator(tokens);
	}
	return tokens;
};