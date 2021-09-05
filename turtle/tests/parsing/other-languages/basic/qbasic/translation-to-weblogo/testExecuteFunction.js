import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteFunction(logger) {
	const cases = [
	{'code': `print F#()
End

Function F# ()
	F# = 0
End Function`, 'messages': ['0']
	},
	];
	processTranslateExecuteCases(cases, logger);
};