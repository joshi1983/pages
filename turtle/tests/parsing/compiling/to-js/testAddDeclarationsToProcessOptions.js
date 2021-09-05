import { addDeclarationsToProcessOptions } from
'../../../../modules/parsing/compiling/to-js/addDeclarationsToProcessOptions.js';
import { assertEquals } from
'../../../helpers/assertEquals.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { testParseWebLogo } from
'../../../helpers/parsing/testParseWebLogo.js';

export function testAddDeclarationsToProcessOptions(logger) {
	const cases = [
		{'code': `print "hi`,
			'declarationSize': 0
		},
		{'code': `to p\nend`,
			'declarationSize': 0
		},
		{'code': `to p :x\nend`,
			'declarationSize': 0
		},
		{'code': `to p :x\nprint :x\nend`,
			'declarationSize': 0
		},
		{'code': `make "x 3`,
			'declarationSize': 1
		},
		{'code': `for ["x 0 3] []`,
			'declarationSize': 1
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = testParseWebLogo(caseInfo.code, plogger);
		if (tree !== undefined) {
			const options = {};
			addDeclarationsToProcessOptions(tree, options);
			if (caseInfo.declarationSize !== undefined)
				assertEquals(caseInfo.declarationSize, options.declarations.size, prefixWrapper(`declarationSize`, plogger));
		}
	});
};