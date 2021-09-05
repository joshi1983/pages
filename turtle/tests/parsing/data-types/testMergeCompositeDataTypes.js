import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { mergeCompositeDataTypes } from '../../../modules/parsing/data-types/mergeCompositeDataTypes.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testMergeCompositeDataTypes(logger) {
	const cases = [
	{'in': 'alphacolor', 'out': 'alphacolor'},
	{'in': 'num', 'out': 'num'},
	{'in': 'color', 'out': 'color'},
	{'in': 'color|int', 'out': 'color'},
	{'in': 'color|colorstring|int', 'out': 'color'},
	{'in': 'color|colorlist|colorstring|int', 'out': 'color'},
	{'in': 'alphacolor|colorlist|colorstring|int', 'out': 'alphacolor'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const inTypes = DataTypes.parse(caseInfo.in);
		mergeCompositeDataTypes(inTypes);
		if (DataTypes.stringify(inTypes) !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${DataTypes.stringify(inTypes)}`);
	});
};