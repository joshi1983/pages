import { AlphaColorType } from '../../../modules/parsing/data-types/AlphaColorType.js';
import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { Token } from '../../../modules/parsing/Token.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testAlphaColorStrings(logger) {
	const cases = [
		{'name': 'red', 'out': true},
		{'name': '#112233', 'out': true},
		{'name': '#11223344', 'out': true},
		{'name': '#011223344', 'out': false},
	];
	const c = new AlphaColorType();
	cases.forEach(function(caseInfo) {
		const token = new Token('"' + caseInfo.name, 0, 0);
		const impossibleTypes = new Set();
		const parseTreeToken = ParseTreeToken.createFromScannedToken(token, impossibleTypes);
		const actualResult = c.mayBeCompatibleWith(parseTreeToken);
		if (actualResult !== caseInfo.out)
			logger('Expected ' + caseInfo.out + ' but got ' + actualResult + ' for color name ' + caseInfo.name);
	});
}

function testAlphaColorNumbers(logger) {
	const alphaColorType = DataTypes.parse('alphacolor').values().next().value;
	const numberType = DataTypes.parse('num').values().next().value;
	if (alphaColorType === undefined || alphaColorType.name !== 'alphacolor')
		logger('Failed to parse "alphacolor".');
	if (numberType === undefined || numberType.name !== 'num')
		logger('Failed to parse "num"');
	if (numberType !== undefined && alphaColorType !== undefined && alphaColorType.name === 'alphacolor') {
		const result = alphaColorType.getIntersectionWith(numberType, DataTypes.createFromName);
		if (result.name !== 'int')
			logger('Expected int as the result type but got ' + result.name);
	}
}

export function testAlphaColorType(logger) {
	wrapAndCall([
		testAlphaColorNumbers,
		testAlphaColorStrings
	], logger);
};