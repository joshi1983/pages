import { declareMissingEqualFixer } from
'../../../../../modules/parsing/pov-ray/translation-to-weblogo/sanitization/declareMissingEqualFixer.js';
import { processFixerTests } from './processFixerTests.js';

export function testDeclareMissingEqualFixer(logger) {
	const cases = [
	{'in': '', 'changed': false},
	{'in': '#declare (', 'changed': false},
	{'in': '#declare [', 'changed': false},
	{'in': '#declare []', 'changed': false},
	{'in': '#declare 4', 'changed': false},
	{'in': '#declare {}', 'changed': false},
	{'in': '#declare "hi"', 'changed': false},
	{'in': '#declare x=4', 'changed': false},
	{'in': '#local x=4', 'changed': false},
	{'in': '#declare x 4', 'out': '#declare x =4'},
	{'in': '#local x=y', 'changed': false},
	{'in': '#declare x y', 'out': '#declare x =y'},
	{'in': '#local x y', 'out': '#local x =y'},
	{'in': '#declare x texture{}', 'out': '#declare x =texture{}'},
	{'in': '#local x texture{}', 'out': '#local x =texture{}'},
	{'in': '#local x 4', 'out': '#local x =4'},
	{'in': '#local x []', 'out': '#local x =[]'},
	{'in': '#declare x []', 'out': '#declare x =[]'},
	{'in': '#local x {}', 'out': '#local x ={}'},
	{'in': '#declare x {}', 'out': '#declare x ={}'},
	{'in': '#local x (3)', 'out': '#local x =(3)'},
	{'in': '#local x "hi"', 'out': '#local x ="hi"'},
	{'in': '#declare x "hi"', 'out': '#declare x ="hi"'},
	{'in': '#local x <3,4>', 'out': '#local x =<3,4>'},
	{'in': '#declare x <3,4>', 'out': '#declare x =<3,4>'},
	{'in': '#local x[2] 4', 'out': '#local x[2] =4'},
	{'in': '#local x[2] "hi"', 'out': '#local x[2] ="hi"'},
	];
	processFixerTests(cases, declareMissingEqualFixer, logger);
};