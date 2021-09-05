import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteRead(logger) {
	const cases = [
	{'code': `READ C$
print C$
DATA "Hello World"`, 'messages': ['Hello World']
	},
	{'code': `for i=1 to 2
	READ C$
	print C$
	restore
next i
DATA "He"`, 'messages': ['He', 'He']
	},
	];
	processTranslateExecuteCases(cases, logger);
};