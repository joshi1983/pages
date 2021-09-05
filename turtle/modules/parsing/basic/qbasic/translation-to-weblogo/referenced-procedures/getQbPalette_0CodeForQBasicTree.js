import { fetchText } from '../../../../../fetchText.js';
import { getSingleScreenNumber } from '../getSingleScreenNumber.js';
import { QBasicColors } from '../../QBasicColors.js';
import { StringUtils } from '../../../../../StringUtils.js';
import { valueToLiteralCode } from '../../../../../valueToLiteralCode.js';

const template = await fetchText('logo-scripts/basic/qbasic/qbPalette_0.lgo');

export function getQbPalette_0CodeForQBasicTree(root) {
	const singleScreenNumber = getSingleScreenNumber(root);
	const colors = QBasicColors.getValuesForScreen(singleScreenNumber);
	const replacementPairs = [
		['[]', ' [ ' + colors.map(c => valueToLiteralCode(c.hex)).join(' ') + ' ] ']
	];
	return StringUtils.replacePairs(template, replacementPairs);
};