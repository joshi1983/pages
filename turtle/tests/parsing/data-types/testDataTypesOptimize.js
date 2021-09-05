import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testDataTypesOptimize(logger) {
	const cases = [
		{'in': null, 'out': ''},
		{'in': 'int|num', 'out': 'num'},
		{'in': 'num|int', 'out': 'num'},
		{'in': 'bool|int|num', 'out': 'bool|num'},
		{'in': 'num|color', 'out': 'color|num'},
		{'in': 'int|color', 'out': 'color'},
		{'in': 'string|color', 'out': 'color|string'},
		{'in': 'colorlist|list<num>', 'out': 'list<num>'},
		{'in': 'colorlist|list<string>', 'out': 'colorlist|list<string>'},
		{'in': 'list<num>|list<string>', 'out': 'list<num|string>'},
		{'in': 'bool|color|colorlist|colorstring|int|list|num|string', 'out': 'alphacolor|bool|list|num|string'},
		{'in': 'bool|color|colorlist|colorstring|int|list|num|string|transparent', 'out': 'alphacolor|bool|list|num|string|transparent'},
		{'in': 'alphacolorlist|alphacolorstring|color|transparent', 'out': 'alphacolor|transparent'},
		{'in': 'alphacolorlist|alphacolorstring|int|transparent', 'out': 'alphacolorlist|alphacolorstring|int|transparent'},
		{'in': 'alphacolorlist|alphacolorstring|colorstring|int|transparent', 'out': 'alphacolorlist|alphacolorstring|colorstring|int|transparent'},
		{'in': 'alphacolorlist|alphacolorstring|colorlist|colorstring|int|transparent', 'out': 'alphacolor|transparent'}
	]
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const actualResult = DataTypes.stringify(new DataTypes(caseInfo.in).types);
		if (actualResult !== caseInfo.out)
			plogger(escapeHTML('Expected ' + caseInfo.out + ' but got ' + actualResult + ' for input ' + caseInfo.in));
	});
};