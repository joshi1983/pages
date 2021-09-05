import { getFuncNamesThatDoNotBeginFills } from
'../../../../../../modules/parsing/python-parsing/new-translation-to-weblogo/parse-tree-simplifiers/helpers/getFuncNamesThatDoNotBeginFills.js';
import { parse } from
'../../../../../../modules/parsing/python-parsing/parsing/parse.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetFuncNamesThatDoNotBeginFills(logger) {
	const cases = [
		{'code': 'def p():\n\tpass', 'out': ['p']},
		{'code': 'def p():\n\tpass\n\nd.begin_fill()\nd.end_fill()', 'out': ['p']},
		{'code': 'def p():\n\tbegin_fill()', 'out': []},
		{'code': 'def p():\n\tend_fill()', 'out': ['p']},
		{'code': 'def p():\n\tbegin_fill()\n\tend_fill()', 'out': ['p']},
		{'code': `def p():
	pass

d.begin_fill()
d.end_fill()
p()
d.end_fill()`, 'out': ['p']}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const result = getFuncNamesThatDoNotBeginFills(parseResult.root);
		if (result === null || typeof result !== 'object')
			plogger(`An object was expected but found ${result}`);
		else {
			const s = result.funcNamesThatDoNotBeginFills;
			if (!(s instanceof Set))
				plogger(`Expected funcNamesThatDoNotBeginFills to be a Set but found ${s}`);
			else {
				const namesStr = Array.from(s).join(',');
				if (s.size !== caseInfo.out.length)
					plogger(`Expected ${caseInfo.out.length} but found a size of ${s.size}, s=${namesStr}`);
				else {
					for (const name of caseInfo.out) {
						if (!s.has(name))
							plogger(`Expected to find a function definition for name ${name} but found ${namesStr}`);
					}
				}
			}
		}
	});
};