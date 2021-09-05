import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translate.js';

export function testTranslateEnd(logger) {
	const cases = [
	{'in': 'end',
'out': ''},
	{'in': `sub s()
	end
end sub`,
'out': `to s
end`},
	{'in': `function s()
	end
end function`,
'out': `to s
end`},
	];
	testInOutPairs(cases, translate, logger);
};