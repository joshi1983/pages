import { naiveStripJavaScriptComments } from
'../../../modules/parsing/js-parsing/naiveStripJavaScriptComments.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

export function testNaiveStripJavaScriptComments(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': 'f()', 'out': 'f()'},
	{'in': '// hi', 'out': ''},
	{'in': '/* hi */', 'out': ''},
	{'in': '/* hi *', 'out': ''},
	{'in': '/* hi ', 'out': ''},
	{'in': '// hi\n', 'out': '\n'},
	{'in': 'f();t()', 'out': 'f();t()'},
	{'in': 'f();/*yo*/t()', 'out': 'f();t()'},
	{'in': 'f();//()', 'out': 'f();'},
	{'in': 'f();///*()*/', 'out': 'f();'},
	{'in': 'f();/*\nt()\n*/', 'out': 'f();'},
	{'in': 'f();/*//*/', 'out': 'f();'},
	];
	testInOutPairs(cases, naiveStripJavaScriptComments, logger);
};