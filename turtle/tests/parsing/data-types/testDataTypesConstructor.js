import { DataTypes } from
'../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from
'../../helpers/escapeHTML.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
await DataTypes.asyncInit();

function check(dataTypes, caseInfo, logger) {
	if (caseInfo.size !== dataTypes.types.size)
		logger(`Expected size of ${caseInfo.size} but got ${dataTypes.types.size}`);
	else if (DataTypes.stringify(dataTypes.types) !== caseInfo.str) {
		logger(escapeHTML(`Expected ${caseInfo.str} but got ${DataTypes.stringify(dataTypes.types)}`));
	}
}

export function testDataTypesConstructor(logger) {
	const cases = [
	{'in': 'colorlist', 'size': 1, 'str': 'colorlist'},
	{'in': 'colorlist|list<int>', 'size': 1, 'str': 'list<int>'},
	{'in': 'colorlist|list<int|string>', 'size': 1, 'str': 'list<int|string>'},
	{'in': 'colorlist|list<num>', 'size': 1, 'str': 'list<num>'},
	{'in': 'alphacolorlist|list<num>', 'size': 1, 'str': 'list<num>'},
	{'in': 'colorlist|list<string>', 'size': 2, 'str': 'colorlist|list<string>'},
	{'in': 'colorlist|list<list<num>>', 'size': 2, 'str': 'colorlist|list<list<num>>'},
	{'in': 'alphacolorlist|list<list<num>>', 'size': 2, 'str': 'alphacolorlist|list<list<num>>'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		let dataTypes = new DataTypes(caseInfo.in);
		check(dataTypes, caseInfo, plogger);
		dataTypes = new DataTypes(dataTypes);
		check(dataTypes, caseInfo, prefixWrapper('After second constructor, ', plogger));
	});
};