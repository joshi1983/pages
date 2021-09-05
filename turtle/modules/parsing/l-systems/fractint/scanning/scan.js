import { convertToArrows } from '../../helpers/convertToArrows.js';
import { FractIntProperties } from '../FractIntProperties.js';
import { insertAssignmentOperators } from '../../helpers/insertAssignmentOperators.js';
import { removeFractIntWrapperTokens } from './removeFractIntWrapperTokens.js';
import { scan as zeroLScan } from '../../0L/scanning/scan.js';

function mightBeProperty(name) {
	return FractIntProperties.getPropertyInfo(name) !== undefined;
}

const tokenTranslators = [
	convertToArrows,
	insertAssignmentOperators(mightBeProperty),
	removeFractIntWrapperTokens
];

export function scan(code) {
	const tokens = zeroLScan(code);
	for (const tokenTranslator of tokenTranslators) {
		tokenTranslator(tokens);
	}
	return tokens;
};