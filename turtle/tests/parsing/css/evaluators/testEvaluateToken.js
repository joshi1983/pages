import { AlphaColour } from '../../../../modules/AlphaColour.js';
import { Colour } from '../../../../modules/Colour.js';
import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { evaluateToken } from '../../../../modules/parsing/css/evaluators/evaluateToken.js';
import { parse } from '../../../../modules/parsing/css/parse.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
await AlphaColour.asyncInit();
await Colour.asyncInit();

export function testEvaluateToken(logger) {
	const cases = [
		{'code': '3', 'out': 3},
		{'code': '"3"', 'out': '3'},
		{'code': '"hi"', 'out': 'hi'},
		{'code': '"\\""', 'out': '"'},
		{'code': `"A really long \\
awesome string"`, 'out': 'A really long \nawesome string'},
		{'code': '2*3', 'out': 6},
		{'code': '2*3-2', 'out': 4},
		{'code': 'calc(2+3)', 'out': 5},
		{'code': 'calc(2 - 3)', 'out': -1},
		{'code': 'clamp(1, 2, 3)', 'out': 2},
		{'code': 'clamp(2.5, 2, 3)', 'out': 2.5},
		{'code': 'clamp(1, 2, 1.5)', 'out': 1.5},
		{'code': 'cos(0deg)', 'out': 1},
		{'code': 'cos(90deg)', 'out': 0, 'tolerance': 0.00001},
		{'code': 'cos(0.25turn)', 'out': 0, 'tolerance': 0.00001},
		{'code': 'e', 'out': Math.E},
		{'code': 'infinity', 'out': Number.POSITIVE_INFINITY},
		{'code': '-infinity', 'out': Number.NEGATIVE_INFINITY},
		{'code': 'log(7.389)', 'out': 2, 'tolerance': 0.00001},
		{'code': 'log(8, 2)', 'out': 3},
		{'code': 'log(625, 5)', 'out': 4},
		{'code': 'max(50, 200, 1)', 'out': 200},
		{'code': 'max(50, 200, 1, 900)', 'out': 900},
		{'code': 'min(50, 200)', 'out': 50},
		{'code': 'min(50, 200, 1)', 'out': 1},
		{'code': 'mod(7, 2)', 'out': 1},
		{'code': 'mod(14, 5)', 'out': 4},
		{'code': 'mod(3.5, 2)', 'out': 1.5},
		{'code': 'mod(10 * 2, 1.7)', 'out': 1.3, 'tolerance': 0.00001},
		{'code': 'pi', 'out': Math.PI},
		{'code': 'pow(5, 2)', 'out': 25},
		{'code': 'pow(2, 5)', 'out': 32},

		/* Here are some cases explained and that you can interact with at 
		https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb 
		*/
		{'code': 'rgb(0 0 0)', 'out': new Colour(0, 0, 0)},
		{'code': 'rgb(0% 0% 0%)', 'out': new Colour(0, 0, 0)},
		{'code': 'rgb(0% 0% 100%)', 'out': new Colour(0, 0, 255)},
		{'code': 'rgb(0%, 0%, 100%)', 'out': new Colour(0, 0, 255)},
		{'code': 'rgb(0 0 255)', 'out': new Colour(0, 0, 255)},
		{'code': 'rgb(0 0 255 / 50%)', 'out': new AlphaColour(128, 0, 0, 255)},
		{'code': 'rgb(0 0 255 / .5)', 'out': new AlphaColour(128, 0, 0, 255)},
		{'code': 'rgb(0 0 255 / 1)', 'out': new Colour(0, 0, 255)},
		{'code': 'rgb(0 0 255 / 2)', 'out': new Colour(0, 0, 255)},
		{'code': 'rgb(0 0 255 / 1000)', 'out': new Colour(0, 0, 255)},
		{'code': 'rgb(0 0 255 / .25)', 'out': new AlphaColour(64, 0, 0, 255)},
		{'code': 'rgb(0 0 2 / 50%)', 'out': new AlphaColour(128, 0, 0, 2)},
		{'code': 'rgb(0 0 2 / 25%)', 'out': new AlphaColour(64, 0, 0, 2)},

		{'code': 'rem(21, 0)', 'out': NaN},
		{'code': 'rem(21, 2)', 'out': 1},
		{'code': 'rem(14, 5)', 'out': 4},
		{'code': 'rem(5.5, 2)', 'out': 1.5},
		{'code': 'sign(-1)', 'out': -1},
		{'code': 'sign(0)', 'out': 0},
		{'code': 'sign(1)', 'out': 1},
		{'code': 'sign(123)', 'out': 1},
		{'code': 'sin(0deg)', 'out': 0},
		{'code': 'sin(90deg)', 'out': 1},
		{'code': 'tan(0deg)', 'out': 0},
		{'code': 'sqrt(4)', 'out': 2},
		{'code': 'sqrt(36)', 'out': 6},
		{'code': 'x', 'out': undefined},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		if (parseResult.root.children.length !== 1)
			plogger(`Expected exactly 1 child but found ${parseResult.root.children.length}`);
		else {
			const onlyChild = parseResult.root.children[0];
			const result = evaluateToken(onlyChild);
			if (!DeepEquality.equals(result, caseInfo.out, caseInfo.tolerance))
				plogger(`Expected ${caseInfo.out} but got ${result}`);
		}
	});
};