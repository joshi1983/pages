import { ColorType } from '../../../modules/parsing/data-types/ColorType.js';
import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { Token } from '../../../modules/parsing/Token.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';

function testColorStrings(logger) {
	const cases = [
		{'name': 'red', 'out': true},
		{'name': 'green', 'out': true},
		{'name': 'Green', 'out': true},
		{'name': 'abcdef', 'out': false},
		{'name': '1', 'out': false},
		{'name': '#', 'out': false},
		{'name': '#123', 'out': true},
		{'name': '#123123', 'out': true},
		{'name': '#dd0', 'out': true},
		{'name': '#880', 'out': true},
	];
	const c = new ColorType();
	cases.forEach(function(caseInfo) {
		const token = new Token('"' + caseInfo.name, 0, 0);
		const impossibleTypes = new Set();
		const parseTreeToken = ParseTreeToken.createFromScannedToken(token, impossibleTypes);
		const actualResult = c.mayBeCompatibleWith(parseTreeToken);
		if (actualResult !== caseInfo.out)
			logger('Expected ' + caseInfo.out + ' but got ' + actualResult + ' for color name ' + caseInfo.name);
	});
}

export function testColorType(logger) {
	const colorType = DataTypes.parse('color').values().next().value;
	const numberType = DataTypes.parse('num').values().next().value;
	if (colorType === undefined || colorType.name !== 'color')
		logger('Failed to parse "color".');
	if (numberType === undefined || numberType.name !== 'num')
		logger('Failed to parse "num"');
	if (numberType !== undefined && colorType !== undefined && colorType.name === 'color') {
		const result = colorType.getIntersectionWith(numberType, DataTypes.createFromName);
		if (result.name !== 'int')
			logger('Expected int as the result type but got ' + result.name);
	}
	testColorStrings(logger);
};