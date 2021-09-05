import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteSpecialVariableNames(logger) {
	const cases = [
	{'code': `dimx = 3
print dimx`,
	'messages': ['3']},
	{'code': `forx = 3
print forx`,
	'messages': ['3']},
	{'code': `ifx = 3
print ifx`,
	'messages': ['3']},
	{'code': `gotox = 4
print gotox`,
	'messages': ['4']},
	{'code': `100 gotox = 4
print gotox`,
	'messages': ['4']},
	{'code': `forx = 5
print forx`,
	'messages': ['5']},
	{'code': `100 forx = 5
print forx`,
	'messages': ['5']},
	{'code': `screen4 = 5
print screen4`,
	'messages': ['5']},
	{'code': `100 screen4 = 5
print screen4`,
	'messages': ['5']},
	{'code': `100 screen4
print 5`,
	'messages': ['5']},
	{'code': `100 type4 = 5
print type4`,
	'messages': ['5']},
	{'code': `100 typex = 5
print typex`,
	'messages': ['5']},
	{'code': `TYPEAnt
x AS INTEGER
END TYPE`, 'messages': []},
	{'code': `wend4 = 5
print wend4`,
	'messages': ['5']},
	{'code': `100 wend4 = 5
print wend4`,
	'messages': ['5']},
	{'code': 'defx=4\nprint defx', 'messages': ['4']},
	{'code': 'defx = 4\nprint defx', 'messages': ['4']},
	{'code': 'defy = 4\nprint defy', 'messages': ['4']},
	{'code': 'defdblx = 4\nprint defdblx', 'messages': ['4']},
	{'code': 'defintx = 4\nprint defintx', 'messages': ['4']},
	{'code': 'deflngx = 4\nprint deflngx', 'messages': ['4']},
	{'code': 'defsngx = 4\nprint defsngx', 'messages': ['4']},
	{'code': 'defstrx = 4\nprint defstrx', 'messages': ['4']},
	{'code': '100 defdblx = 4\nprint defdblx', 'messages': ['4']},
	{'code': '100 defintx = 4\nprint defintx', 'messages': ['4']},
	{'code': '100 deflngx = 4\nprint deflngx', 'messages': ['4']},
	{'code': '100 defsngx = 4\nprint defsngx', 'messages': ['4']},
	{'code': '100 defstrx = 4\nprint defstrx', 'messages': ['4']}
	];
	processTranslateExecuteCases(cases, logger);
};