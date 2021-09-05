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
	{'code': `function double#(n#)
	double# = 2 * n#
End Function

print double#(3)`, 'messages': ['6']
	},
	{'code': `function recursiveFactorial#(n#)
	if n# = 1 then
		recursiveFactorial# = 1
	else
		recursiveFactorial# = n# * recursiveFactorial#(n# - 1)
	end if
End Function

print recursiveFactorial#(4)`, 'messages': ['24']
	},
	];
	processTranslateExecuteCases(cases, logger);
};