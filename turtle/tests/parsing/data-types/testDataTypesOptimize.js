import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';

export function testDataTypesOptimize(logger) {
	const cases = [
	{'in': null, 'out': ''},
	{'in': 'int|num', 'out': 'num'},
	{'in': 'num|int', 'out': 'num'},
	{'in': 'bool|int|num', 'out': 'bool|num'},
	{'in': 'num|color', 'out': 'color|num'},
	{'in': 'int|color', 'out': 'color'},
	{'in': 'string|color', 'out': 'color|string'},
	{'in': 'bool|color|colorlist|colorstring|int|list|num|string', 'out': 'bool|color|list|num|string'},
	{'in': 'bool|color|colorlist|colorstring|int|list|num|string|transparent', 'out': 'bool|color|list|num|string|transparent'}
	]
	cases.forEach(function(caseInfo) {
		const actualResult = DataTypes.stringify(new DataTypes(caseInfo.in).types);
		if (actualResult !== caseInfo.out)
			logger('Expected ' + caseInfo.out + ' but got ' + actualResult + ' for input ' + caseInfo.in);
	});
};