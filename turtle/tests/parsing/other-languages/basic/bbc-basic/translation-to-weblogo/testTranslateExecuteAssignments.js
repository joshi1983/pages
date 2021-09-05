import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testTranslateExecuteAssignments(logger) {
	const cases = [
	{'code': `A=1
A+=2
PRINT A`, 'messages': ['3']},
	{'code': `A=2
A+=3
PRINT A`, 'messages': ['5']},
	{'code': `A=3
A*=2
PRINT A`, 'messages': ['6']},
	{'code': `A=4
A*=3
PRINT A`, 'messages': ['12']},
	{'code': `A=3
A/=2
PRINT A`, 'messages': ['1.5']},
	{'code': `A=3
A/=4
PRINT A`, 'messages': ['0.75']},
	{'code': `A=3
A-=2
PRINT A`, 'messages': ['1']},
	{'code': `A=5
A-=3
PRINT A`, 'messages': ['2']},
	{'code': `A=3
A mod=2
PRINT A`, 'messages': ['1']},
	{'code': `A=4
A mod=2
PRINT A`, 'messages': ['0']},
	{'code': `A=4
A Mod=2
PRINT A`, 'messages': ['0']},
	{'code': `A=4
A div=2
PRINT A`, 'messages': ['2']},
	{'code': `A=4
A DIV=2
PRINT A`, 'messages': ['2']},
	{'code': `A=false
A OR= true
PRINT A`, 'messages': ['true']},
	{'code': `A=false
A OR= false
PRINT A`, 'messages': ['false']},
	{'code': `A=true
A OR= false
PRINT A`, 'messages': ['true']},
	{'code': `A=true
A EOR= false
PRINT A`, 'messages': ['true']},
	{'code': `A=false
A EOR= true
PRINT A`, 'messages': ['true']},
	{'code': `A=true
A EOR= true
PRINT A`, 'messages': ['false']},
	{'code': `x = 1
PRINT x
PROC_P()
PRINT x
	
DEF PROC_P ()
	LOCAL x
	x = 3
	PRINT x
ENDPROC`, 'messages': ['1', '3', '1']}
	];
	processTranslateExecuteCases(cases, logger);
};