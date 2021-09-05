import { AlphaColour } from
'../../../../../AlphaColour.js';
import { Colour } from
'../../../../../Colour.js';
import { evaluateLiteralToken } from
'../../../../js-parsing/evaluators/evaluateLiteralToken.js';
import { evaluateToken as cssEvaluateToken } from
'../../../../css/evaluators/evaluateToken.js';
import { filterBracketsAndCommas } from
'../../../../css/filterBracketsAndCommas.js';
import { isNumber } from
'../../../../../isNumber.js';
import { parse as cssParse } from
'../../../../css/parse.js';
import { ParseTreeTokenType as CSSParseTreeTokenType } from
'../../../../css/ParseTreeTokenType.js';

function constainsNonNumber(vals) {
	return vals.some(v => !isNumber(v));
}

function rgbaToWebLogoVal(argVals) {
	const [r,g,b,alpha] = argVals;
	return new AlphaColour(alpha * 255, r,g,b).toString();
}

export function jsProcessingColorArgsToWebLogoColorLiteral(args) {
	const argVals = args.map(evaluateLiteralToken);
	if (args.length === 1) {
		const val = argVals[0];
		if (typeof val === 'string') {
			const cssParseResult = cssParse(val);
			if (cssParseResult.root.children.length === 1) {
				const child = cssParseResult.root.children[0];
				if (child.type === CSSParseTreeTokenType.FUNCTION_CALL) {
					const nameToken = child.children[0];
					const argList = child.children[1];
					const cssArgs = filterBracketsAndCommas(argList.children);
					const cssArgVals = cssArgs.map(cssEvaluateToken);					
					if (constainsNonNumber(cssArgVals))
						return;

					if (nameToken.val === 'rgb' && cssArgVals.length === 3) {
						return new Colour(...cssArgVals).toString();
					}
					else if (nameToken.val === 'rgba' && cssArgVals.length === 4) {
						return rgbaToWebLogoVal(cssArgVals);
					}
				}
			}
		}
	}
	else if (args.length === 3) {
		if (constainsNonNumber(argVals))
			return;
		return new Colour(...argVals).toString();
	}
	else if (args.length === 4) {
		if (constainsNonNumber(argVals))
			return;
		return rgbaToWebLogoVal(argVals);
	}
};

export function processArgsAsSingleColor(args, result) {
	const webLogoLiteral = jsProcessingColorArgsToWebLogoColorLiteral(args);
	if (webLogoLiteral !== undefined) {
		result.append(webLogoLiteral);
		return true;
	}
	return false;
};