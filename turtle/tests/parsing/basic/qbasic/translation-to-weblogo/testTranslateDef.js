import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translate.js';

export function testTranslateDef(logger) {
	const cases = [
	{'in': `DEF fnTest
END DEF`,
'out': `to fnTest
end`},
	{
	'in': `def add (x, y)
    add = x + y
END DEF`,
'out': `to add :x :y
	output :x + :y
end`},
	];
	testInOutPairs(cases, translate, logger);
};