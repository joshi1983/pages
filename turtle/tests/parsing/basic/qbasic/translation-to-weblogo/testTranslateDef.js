import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

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
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};