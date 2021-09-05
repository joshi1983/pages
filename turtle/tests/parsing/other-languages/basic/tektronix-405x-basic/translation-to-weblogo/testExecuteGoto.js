import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteGoto(logger) {
	const cases = [
		{'code': `100 x=0
200 if x>=3 then 270
210 x=x+1
220 print x
260 go to 200
270 print "done"`,
		'messages': ['1', '2', '3', 'done']}
	];
	processTranslateExecuteCases(cases, logger);
};