import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

function getTypesArrayFrom(typesInfo) {
	return typesInfo.map(function(typeInfo) {
		const types = DataTypes.parse(typeInfo);
		if (types.size !== 1)
			throw new Error(`Expected a size of 1 but got ${types.size}`);
		return types.values().next().value;
	});
}

export function testDataTypesSortBySetSize(logger) {
	const cases = [
	{'in': ['bool','num'], 'out': ['bool','num']}, // nothing worth changing
	{'in': ['int','num'], 'out': ['num','int']},
	{'in': ['alphacolorlist','list'], 'out': ['list','alphacolorlist']},
	{'in': ['colorlist','list'], 'out': ['list','colorlist']},
	{'in': ['color','alphacolor'], 'out': ['alphacolor','color']},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in: ${caseInfo.in.join(',')}`, logger);
		const types = getTypesArrayFrom(caseInfo.in);
		DataTypes.sortBySetSize(types);
		if (types.length !== caseInfo.out.length)
			plogger(`Expected length to be ${caseInfo.out.length} but got ${types.length}`);
		else {
			for (let i = 0; i < types.length; i++) {
				if (types[i].toString() !== caseInfo.out[i])
					plogger(`Expected ${caseInfo.out[i]} at index ${i} but got ${types[i].toString()}`);
			}
		}
	});
};