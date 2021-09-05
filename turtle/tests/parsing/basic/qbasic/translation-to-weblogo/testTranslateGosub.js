import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateGosub(logger) {
	const cases = [
	{'in': `sub s()
	print "hi"
end sub
gosub s`,
	'out': `to s
	print "hi
end

s`}
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};