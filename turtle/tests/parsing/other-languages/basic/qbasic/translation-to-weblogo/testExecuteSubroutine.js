import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteSubroutine(logger) {
	const cases = [
	{'code': `Render
Sleep
End

Sub Render ()
	Print "hi"
End Sub`, 'messages': ['hi']
	},
	];
	processTranslateExecuteCases(cases, logger);
};