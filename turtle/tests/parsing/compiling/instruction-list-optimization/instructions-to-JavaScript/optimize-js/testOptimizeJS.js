import { optimizeJS } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimizeJS.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

export function testOptimizeJS(logger) {
	const cases = [
		{'in': 'context.turtle.right(90)', 'changed': false},
		{'in': 'context.valueStack.push(4)', 'changed': false},
		{'in': 'context.turtle.setLineCap(2)', 'changed': false},
		{'in': 'context.localmake("center",context.turtle.pos())', 'changed': false},
		{'in': 'context.make("center",context.turtle.pos())', 'changed': false},
		{'in': 'context.localmake("linelength",(context.getCurrentExecutingProcedure().localVariables.get("radius")) * 0.78)',
		'out': `context.localmake("linelength", context.getCurrentExecutingProcedure().localVariables.get("radius") * 0.78)`},
		{'in': `context.turtle.roundRect(this.validateNumber(this.errorCaseCheck6(context.getCurrentExecutingProcedure().localVariables.get("height"))),
this.validateNumber(this.errorCaseCheck5(context.getCurrentExecutingProcedure().localVariables.get("height"))),
this.validateNumber(this.errorCaseCheck4((context.getCurrentExecutingProcedure().localVariables.get("height")) * 0.147869)))`,
	'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let height = localVariables.get("height");
context.turtle.roundRect(this.validateNumber(this.errorCaseCheck6( height )),
this.validateNumber(this.errorCaseCheck5( height )),
this.validateNumber(this.errorCaseCheck4( height * 0.147869)))`},
		{'in': `context.valueStack.push(
((context.getCurrentExecutingProcedure().localVariables.get("x")) * (context.getCurrentExecutingProcedure().localVariables.get("x")))
+ ((context.getCurrentExecutingProcedure().localVariables.get("y")) * (context.getCurrentExecutingProcedure().localVariables.get("y"))))`,
		'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let x = localVariables.get("x");
let y = localVariables.get("y");
context.valueStack.push(
( x * x )
+ ( y * y ))`},
	{'in': `context.localmake("x",(
((context.getCurrentExecutingProcedure().localVariables.get("oldre")) * (context.getCurrentExecutingProcedure().localVariables.get("oldre")))
- ((context.getCurrentExecutingProcedure().localVariables.get("oldim")) * (context.getCurrentExecutingProcedure().localVariables.get("oldim"))))
+ -0.704029749122184)`, 'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let oldre = localVariables.get("oldre");
let oldim = localVariables.get("oldim");
localVariables. set("x",(
( oldre * oldre )
- ( oldim * oldim ))
+ -0.704029749122184)`},
	{'in': `context.make("c",
context.list.list(context.globalVariables.get("v"),
context.globalVariables.get("v"),
context.globalVariables.get("v")))`,
'out': `let v = context.globalVariables.get("v");
context.make("c",
context.list.list( v ,
v ,
v ))`},
	];
	cases.forEach(function(caseInfo) {
		if (caseInfo.changed === false)
			caseInfo.out = caseInfo.in;
	});
	testInOutPairs(cases, optimizeJS, logger);
};