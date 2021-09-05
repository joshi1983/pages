import { CachedParseTree } from '../../../../modules/parsing/parse-tree-analysis/CachedParseTree.js';
import { Colour } from '../../../../modules/Colour.js';
import { EaseIn } from '../../../../modules/drawing/vector/easing/EaseIn.js';
import { LinearGradient } from '../../../../modules/drawing/vector/shapes/gradients/LinearGradient.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { SpreadMethod } from '../../../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';
import { Transparent } from '../../../../modules/Transparent.js';
import { validateDataTypes } from '../../../../modules/parsing/parse-tree-analysis/validation/validateDataTypes.js';
import { Vector2D } from '../../../../modules/drawing/vector/Vector2D.js';
await LogoParser.asyncInit();

export function testValidateDataTypes2SpecialCases(logger) {
	const code = 'fd 100';
	const parseLogger = new TestParseLogger(logger, code);
	const rootToken = LogoParser.getParseTree(code, parseLogger);
	const procedures = new Map();
	const colorStops = new Map([[0, new Colour("red")], [1, new Colour("black")]]);
	const from = new Vector2D(0, 0);
	const to = new Vector2D(100, 0);
	const linearGradient = new LinearGradient(colorStops, from, to, SpreadMethod.Pad);
	const initialVariables = new Map([
		['a', 1],
		['b', new Map()],
		['c', []],
		['d', [1,2,3]],
		['e', true],
		['f', 'hello'],
		['g', 'red'],
		['h', '#123'],
		['i', linearGradient],
		['j', Transparent],
		['l', new EaseIn()],
		['m', new Map([
				[0, 'black'],
				[1, 'white']
			])
		],
		['n', {
			"spreadMethod": SpreadMethod.Pad,
			"colorStops":{},
			"usesOnlyEaseLinear":true,
			"from":{"coords":[0,0]},
			"to":{"coords":[0,100]}
		}/*
		Might be an initial variable value if a previous script
		assigned a LinearGradient to a global variable
		*/
		]
	]);
	const tree = new CachedParseTree(rootToken, procedures, initialVariables);
	validateDataTypes(tree, parseLogger);
};