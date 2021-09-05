import { addEndIf } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/addEndIf.js';
import { processFixerCases } from './processFixerCases.js';

export function testAddEndIf(logger) {
	const cases = [
	{'code': '', 'to': ''},
	{'code': `if x then
end if`, 'changed': false},
	{'code': `if x then
	print "hi"`, 'to': `if x then
	print "hi"
END IF`},
	];
	processFixerCases(cases, addEndIf, logger);
};