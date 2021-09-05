import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { explodeCompositeDataTypes } from '../../../modules/parsing/data-types/explodeCompositeDataTypes.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
await DataTypes.asyncInit();

function typeToString(type) {
	const types = new Set([type]);
	return DataTypes.stringify(types);
}

function findType(types, type) {
	for (let type1 of types) {
		if (type1.equals(type))
			return true;
	}
	return false;
}

export function testExplodeCompositeDataTypes(logger) {
	const cases = [
	{'in': 'num', 'out': ['num']},
	{'in': 'int', 'out': ['int']},
	{'in': 'color', 'out': ['int', 'colorlist', 'colorstring']},
	{'in': 'alphacolor', 'out': ['alphacolorlist', 'alphacolorstring', 'color', 'colorlist', 'colorstring', 'int']},
	{'in': 'list', 'out': ['list']},
	{'in': 'list<int>', 'out': ['list<int>']},
	{'in': 'colorlist|list<string>', 'out': ['colorlist', 'list<string>']},
	{'in': 'colorlist|list<list>', 'out': ['colorlist', 'list<list>']},
	{'in': 'colorlist|list<list<num>>', 'out': ['colorlist', 'list<list<num>>']},
	];
	cases.forEach(function(caseInfo, index) {
		const inTypes = new DataTypes(caseInfo.in);
		const outTypes = explodeCompositeDataTypes(inTypes.types);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if (outTypes.size !== caseInfo.out.length)
			plogger(escapeHTML(`Expected size of ${caseInfo.out.length} but got ${outTypes.size}.  Expected ${caseInfo.out.join(',')} but got ${Array.from(outTypes).join(',')}`));
		else {
			caseInfo.out.forEach(function(outType) {
				outType = DataTypes.parse(outType);
				if (outType.size !== 1)
					plogger(`Expected size of 1 but got ${outType.size}`);
				else {
					outType = outType.values().next().value;
					if (!findType(outTypes, outType))
						plogger(escapeHTML(`Expected to find ${typeToString(outType)} but not found in ${Array.from(outTypes).map(t => t.toString()).join(',')}`));
				}
			});
		}
	});
};