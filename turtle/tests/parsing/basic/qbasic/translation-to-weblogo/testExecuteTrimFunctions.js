import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteTrimFunctions(logger) {
	const cases = [
	{'code': 'print ltrim$("")',
	'messages': ['']},
	{'code': 'print ltrim$("h")',
	'messages': ['h']},
	{'code': 'print ltrim$(" regularSpace")',
	'messages': ['regularSpace']},
	{'code': 'print ltrim$("	tab")',
	'messages': ['tab']},
	{'code': 'print ltrim$("spacesAfter 	")',
	'messages': ['spacesAfter 	']},
	{'code': 'print rtrim$("")',
	'messages': ['']},
	{'code': 'print rtrim$("spacesAfter 	")',
	'messages': ['spacesAfter']},
	{'code': 'print rtrim$(" spacesBefore")',
	'messages': [' spacesBefore']}
	];
	processTranslateExecuteCases(cases, logger);
};