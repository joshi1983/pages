import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteLineInput(logger) {
	const cases = [
	{'code': `line input x
print "hi"`,
	'messages': ['hi']},
	{'code': `line input x
print x`,
	'messages': ['lineOfText']}
	];
	processTranslateExecuteCases(cases, logger);
};