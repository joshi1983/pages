import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslateFunction(logger) {
	const cases = [
	{'in': `FUNCTION fnTest
END FUNCTION`,
'out': `to fnTest
end`},
	{
	'in': `function echo (x)
    echo = x
END FUNCTION`,
'out': `to echo :x
	output :x
end`},
	{
	'in': `function add (x, y)
    add = x + y
END FUNCTION`,
'out': `to add :x :y
	output :x + :y
end`},
	];
	testInOutPairs(cases, translate, logger);
};