import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateTurtleToyNetToWebLogo } from
'../../../../modules/parsing/turtletoy-net/translation-to-weblogo/translateTurtleToyNetToWebLogo.js';

export function testTranslateFunctionCalls(logger) {
	const cases = [
		{'in': `const turtle = new Turtle();`, 'out': ''},
		{'in': `let turtle = new Turtle();`, 'out': ''},
		{'in': `var turtle = new Turtle();`, 'out': ''},
		{'in': `turtle = new Turtle();`, 'out': ''},
		{'in': `bla = new Turtle();`, 'out': ''},
		{'in': `const turtle = new Turtle();
turtle.circle(100)`, 'out': 'circle 100'},
		{'in': `const turtle = new Turtle();
turtle.goto(1,2)`, 'out': 'setPos [ 1 2 ]'},
	];
	testInOutPairs(cases, translateTurtleToyNetToWebLogo, logger);
};