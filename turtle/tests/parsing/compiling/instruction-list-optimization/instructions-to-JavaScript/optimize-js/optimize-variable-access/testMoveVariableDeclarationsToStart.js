import { flatten } from '../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getWebLogoVariablesFromJS } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/getWebLogoVariablesFromJS.js';
import { moveVariableDeclarationsToStart } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/moveVariableDeclarationsToStart.js';
import { parse } from
'../../../../../../../modules/parsing/js-parsing/parse.js';
import { testInOutPairs } from
'../../../../../../helpers/testInOutPairs.js';

function processCode(jsCode) {
	const parseResult = parse(jsCode);
	const allTokens = flatten(parseResult.root);
	const variables = getWebLogoVariablesFromJS(allTokens);
	return moveVariableDeclarationsToStart(allTokens, variables, false);
}

export function testMoveVariableDeclarationsToStart(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': `context.turtle.print(a);
const a = context.readVariable("a");
context.turtle.print(a)`,
'out': `let a = context.readVariable("a");
context.turtle.print(a);
 ;
context.turtle.print(a)`},
	{'in': `context.make("animationratio",1);
context.valueStack.push( animationratio <= 0.5);
let animationratio = context.readVariable("animationratio")`,
'out': `let animationratio = context.readVariable("animationratio");
animationratio=1 ;
context.valueStack.push( animationratio <= 0.5);
context.make("animationratio", animationratio);`},
	{'in': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
localVariables.set("radius",1);
localVariables.set("numintervals", context.repcount() - 1);
let numintervals = localVariables.get('numintervals');
context.valueStack.push( numintervals <= 2);
if (!context.valueStack.pop()) {
numintervals=4 - numintervals ;
}
context.localmake('numintervals', numintervals);`,
	'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let numintervals = localVariables.get('numintervals');
;
localVariables.set("radius",1);
numintervals= context.repcount() - 1 ;
 ;
context.valueStack.push( numintervals <= 2);
if (!context.valueStack.pop()) {
numintervals=4 - numintervals ;
}
context.localmake('numintervals', numintervals);`},
	{'in': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
context.turtle.print(a);
let a = localVariables.get("a");`,
	'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let a = localVariables.get("a");
;
context.turtle.print(a);
 ;`},
	{'in': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let column = localVariables.get("column");
localVariables. set("radius",context.math.mix( localVariables.get("maxradius"), localVariables.get("minradius"),( column - 1) / 5));
localVariables. set("numintervals", column - 1);
context.valueStack.push(localVariables. get("numintervals") <= 2);

if (!context.valueStack.pop()) {
context.localmake("numintervals",4 - context.getCurrentExecutingProcedure().localVariables.get("numintervals") );
}

const localVariables = context.getCurrentExecutingProcedure().localVariables;
let numintervals = localVariables.get("numintervals");
localVariables. set("totalintervals",( numintervals * 2) + 1);
localVariables. set("pos1",context.turtle.pos());
context.turtle.jumpForward( numintervals * localVariables.get("vseparation") );
context.valueStack.push(localVariables. get("totalintervals"));`,
	'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let column = localVariables.get("column");
let numintervals = localVariables.get("numintervals");
;
 ;
localVariables. set("radius",context.math.mix( localVariables.get("maxradius"), localVariables.get("minradius"),( column - 1) / 5));
numintervals= column - 1 ;
context.valueStack.push( numintervals <= 2);

if (!context.valueStack.pop()) {
numintervals=4 - numintervals ;
}

;
 ;
localVariables. set("totalintervals",( numintervals * 2) + 1);
localVariables. set("pos1",context.turtle.pos());
context.turtle.jumpForward( numintervals * localVariables.get("vseparation") );
context.valueStack.push(localVariables. get("totalintervals"));
localVariables.set("numintervals", numintervals);`},
	{'in': ` ;
let column = localVariables.get("column");
localVariables. set("radius",context.math.mix( localVariables.get("maxradius"), localVariables.get("minradius"),( column - 1) / 5));
localVariables. set("numintervals", column - 1);
context.valueStack.push(localVariables. get("numintervals") <= 2);

if (!context.valueStack.pop()) {
context.localmake("numintervals",4 - context.getCurrentExecutingProcedure().localVariables.get("numintervals") );
}

 ;
let numintervals = localVariables.get("numintervals");
localVariables. set("totalintervals",( numintervals * 2) + 1);
localVariables. set("pos1",context.turtle.pos());
context.turtle.jumpForward( numintervals * localVariables.get("vseparation") );
context.valueStack.push(localVariables. get("totalintervals"));`,
	'out': `let column = localVariables.get("column");
let numintervals = localVariables.get("numintervals");
;
 ;
localVariables. set("radius",context.math.mix( localVariables.get("maxradius"), localVariables.get("minradius"),( column - 1) / 5));
numintervals= column - 1 ;
context.valueStack.push( numintervals <= 2);

if (!context.valueStack.pop()) {
numintervals=4 - numintervals ;
}

;
 ;
localVariables. set("totalintervals",( numintervals * 2) + 1);
localVariables. set("pos1",context.turtle.pos());
context.turtle.jumpForward( numintervals * localVariables.get("vseparation") );
context.valueStack.push(localVariables. get("totalintervals"));
context.localmake("numintervals", numintervals);`},
{'in': `if (!(context.readVariable("colorindex") > 0)) {
context.localmake("colorindex", context.getCurrentExecutingProcedure().localVariables.get("colorindex") + 1);
};
let colorindex = context.getCurrentExecutingProcedure().localVariables.get("colorindex");
context.turtle.setFillColor(this.convertToAlphaColourOrTransparent(context.list.item(colorindex ,context.globalVariables.get("colors"))));
context.valueStack.push(context.readVariable("size") * 0.38197);
context.valueStack.push(colorindex - 1);`,

'out': `let colorindex = context.getCurrentExecutingProcedure().localVariables.get("colorindex");
if (!( colorindex > 0)) {
colorindex= colorindex + 1 ;
};
 ;
context.turtle.setFillColor(this.convertToAlphaColourOrTransparent(context.list.item(colorindex ,context.globalVariables.get("colors"))));
context.valueStack.push(context.readVariable("size") * 0.38197);
context.valueStack.push(colorindex - 1);
context.localmake("colorindex", colorindex);`}
	];
	testInOutPairs(cases, processCode, logger);
};