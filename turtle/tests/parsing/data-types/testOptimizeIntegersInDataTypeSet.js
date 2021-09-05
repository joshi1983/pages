import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { optimizeIntegersInDataTypeSet } from
'../../../modules/parsing/data-types/optimizeIntegersInDataTypeSet.js';
import { parseDataTypeString } from '../../../modules/parsing/data-types/data-type-parsing/parseDataTypeString.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
await DataTypes.asyncInit();

function stringToTypes(s) {
	const parseTree = parseDataTypeString(s);
	return DataTypes.parseTokensToDataTypeSet(parseTree.children);
}

export function testOptimizeIntegersInDataTypeSet(logger) {
	const cases = [
		{'in': 'num', 'changed': false},
		{'in': 'string', 'changed': false},
		{'in': 'int', 'changed': false},
		{'in': 'int(min=0)', 'changed': false},
		{'in': 'int(max=1,min=1)|int(min=0)', 'out': 'int(min=0)'},
		{'in': 'int(max=0,min=0)|int(max=0,min=0)', 'out': 'int(max=0,min=0)'},
		{'in': 'int(max=0,min=0)|int(max=0,min=0)|int(max=1,min=1)', 'out': 'int(max=1,min=0)'},
		{'in': 'int(max=0,min=0)|int(max=1,min=1)|int(max=2,min=2)', 'out': 'int(max=2,min=0)'},
		{'in': 'int(max=2,min=2)|int(max=1,min=1)|int(max=0,min=0)', 'out': 'int(max=2,min=0)'},
		{'in': 'int(max=0,min=0)|int(max=1,min=1)', 'out': 'int(max=1,min=0)'},
		{'in': 'int(max=1,min=1)|int(max=0,min=0)', 'out': 'int(max=1,min=0)'},
		{'in': 'int(max=1,min=1)|int(max=10,min=10)', 'out': 'int(max=1,min=1)|int(max=10,min=10)'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const types = stringToTypes(caseInfo.in);
		optimizeIntegersInDataTypeSet(types);
		if (caseInfo.changed === false)
			caseInfo.out = caseInfo.in;
		if (DataTypes.stringify(types) !== caseInfo.out)
			plogger(escapeHTML(`Expected ${caseInfo.out} but got ${DataTypes.stringify(types)}`));
	});
};