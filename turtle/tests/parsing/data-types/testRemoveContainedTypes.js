import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { removeContainedTypes } from '../../../modules/parsing/data-types/removeContainedTypes.js';

export function testRemoveContainedTypes(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': 'num', 'out': 'num'},
	{'in': 'string', 'out': 'string'},
	{'in': 'list', 'out': 'list'},
	{'in': 'num|num', 'out': 'num'},
	{'in': 'colorlist|list', 'out': 'list'},
	{'in': 'alphacolorlist|list', 'out': 'list'},
	{'in': 'colorlist|alphacolorlist', 'out': 'alphacolorlist'},
	{'in': 'colorlist|list<string>', 'out': 'colorlist|list<string>'}
	// list<num> contains colorlist but list<string> does not.
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		let types = DataTypes.parse(caseInfo.in);
		types = removeContainedTypes(types);
		if (DataTypes.stringify(types) !== caseInfo.out)
			plogger(escapeHTML(`Expected ${caseInfo.out} but got ${DataTypes.stringify(types)}`));
	});
};