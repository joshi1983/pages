import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { isDataTypeContaining } from '../../../modules/parsing/data-types/isDataTypeContaining.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

export function testIsDataTypeContaining(logger) {
	const cases = [
	{'inArgs': ['bool', 'list'], 'out': false},
	{'inArgs': ['num', 'list'], 'out': false},
	{'inArgs': ['string', 'list'], 'out': false},
	{'inArgs': ['num', 'int'], 'out': true},
	{'inArgs': ['num(finite)', 'num'], 'out': false},
	{'inArgs': ['num', 'num(finite)'], 'out': true},
	{'inArgs': ['num(unfinite)', 'num'], 'out': false},
	{'inArgs': ['num', 'num(unfinite)'], 'out': true},
	{'inArgs': ['string', 'colorstring'], 'out': true},
	{'inArgs': ['list', 'colorlist'], 'out': true},
	{'inArgs': ['list', 'alphacolorlist'], 'out': true},
	{'inArgs': ['alphacolorstring', 'colorstring'], 'out': false},
	{'inArgs': ['alphacolorlist', 'colorlist'], 'out': false},
	];
	cases.forEach(function(caseInfo) {
		caseInfo.inArgs = caseInfo.inArgs.map(function(name) {
			const types = DataTypes.parse(name);
			return types.values().next().value;
		});
	});
	testInOutPairs(cases, isDataTypeContaining, logger);
};