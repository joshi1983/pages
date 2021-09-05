import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { optimizeListsInDataTypeSet } from '../../../modules/parsing/data-types/optimizeListsInDataTypeSet.js';
import { parseDataTypeString } from '../../../modules/parsing/data-types/data-type-parsing/parseDataTypeString.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

function stringToTypes(s) {
	const parseTree = parseDataTypeString(s);
	return DataTypes.parseTokensToDataTypeSet(parseTree.children);
}

export function testOptimizeListsInDataTypeSet(logger) {
	const cases = [
	{'in': 'num', 'out': 'num'},
	{'in': 'string', 'out': 'string'},
	{'in': 'list', 'out': 'list'},
	{'in': 'list<num>', 'out': 'list<num>'},
	{'in': 'list<num>(minlen=3)', 'out': 'list<num>(minlen=3)'},
	{'in': 'colorlist', 'out': 'colorlist'},
	{'in': 'list<num>|list<string>', 'out': 'list<num|string>'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const types = stringToTypes(caseInfo.in);
		optimizeListsInDataTypeSet(types);
		if (DataTypes.stringify(types) !== caseInfo.out)
			plogger(escapeHTML(`Expected ${caseInfo.out} but got ${DataTypes.stringify(types)}`));
	});
};