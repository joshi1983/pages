import { optimizeVariableAccessInJavaScript } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimizeVariableAccessInJavaScript.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

export function testOptimizeVariableAccessInJavaScript(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{
		'in': 'context.localmake("oldstate",context.turtle.turtleState())',
		'changed': false
	},
	{
		'in': 'context.turtle.jumpForward(this.validateNumber(context.getCurrentExecutingProcedure().localVariables.get("height1")))',
		'changed': false
	},
	{
		'in': 'context.localmake("x",(((localVariables.get("oldre")) * (localVariables.get("oldre"))) - ((localVariables.get("oldim")) * (localVariables.get("oldim")))) + -0.704029749122184)',
		'out': 'let oldre = context.getCurrentExecutingProcedure().localVariables.get("oldre");\nlet oldim = context.getCurrentExecutingProcedure().localVariables.get("oldim");\ncontext.localmake("x",((( oldre ) * ( oldre )) - (( oldim ) * ( oldim ))) + -0.704029749122184)'
	},
	{
		'in': 'context.localmake("x",1);\ncontext.localmake("x",2);',
		'out': 'let x = context.getCurrentExecutingProcedure().localVariables.get("x");\nx=1 ;\n x=2 ;\ncontext.localmake("x", x);'
	},
	{
		'in': 'context.localmake("zy",(2 * (context.getCurrentExecutingProcedure().localVariables.get("xt"))) + (context.getCurrentExecutingProcedure().localVariables.get("y")))',
		'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
localVariables. set("zy",(2 * ( localVariables.get("xt"))) + ( localVariables.get("y")))`
	},
	{'in': 'context.turtle.setPenSize(this.validateNumber(this.errorCaseCheck6(0)))',
	'out': 'context.turtle.setPenSize(this.validateNumber(this.errorCaseCheck6(0)))'},
	{'in': 'context.turtle.setPenColor(this.convertToAlphaColourOrTransparent(context.globalVariables.get("seatcolor")))',
	'out': 'context.turtle.setPenColor(this.convertToAlphaColourOrTransparent(context.globalVariables.get("seatcolor")))'},
	{'in': `context.localmake("maxradius",(context.getCurrentExecutingProcedure().localVariables.get("height")) * 0.101);
context.localmake("minradius",(context.getCurrentExecutingProcedure().localVariables.get("height")) * 0.06);
context.localmake("midradius",((context.getCurrentExecutingProcedure().localVariables.get("maxradius")) + (context.getCurrentExecutingProcedure().localVariables.get("minradius"))) / 2);
context.localmake("vseparation",((context.getCurrentExecutingProcedure().localVariables.get("height")) - (((context.getCurrentExecutingProcedure().localVariables.get("midradius")) * 0.93) * 2)) / 4);
context.localmake("hseparations",[1,2]);
context.valueStack.push("column",1,2,1);`,
	'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let height = localVariables.get("height");
localVariables. set("maxradius",( height ) * 0.101);
localVariables. set("minradius",( height ) * 0.06);
localVariables. set("midradius",(( localVariables.get("maxradius")) + ( localVariables.get("minradius"))) / 2);
localVariables. set("vseparation",(( height ) - ((( localVariables.get("midradius")) * 0.93) * 2)) / 4);
localVariables. set("hseparations",[1,2]);
context.valueStack.push("column",1,2,1);`},
	{'in': `context.localmake("totalintervals",((context.getCurrentExecutingProcedure().localVariables.get("numintervals")) * 2) + 1);
context.localmake("pos1",context.turtle.pos());
context.turtle.jumpForward((context.getCurrentExecutingProcedure().localVariables.get("numintervals")) * (context.getCurrentExecutingProcedure().localVariables.get("vseparation")));
context.valueStack.push(context.readVariable("totalintervals"));`,
	'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let numintervals = localVariables.get("numintervals");
localVariables. set("totalintervals",((numintervals ) * 2) + 1);
localVariables. set("pos1",context.turtle.pos());
context.turtle.jumpForward((numintervals ) * ( localVariables.get("vseparation")));
context.valueStack.push(localVariables. get("totalintervals"));`},
	{'in': `context.turtle.setHeading(context.turtle.towards( context.readVariable("prevp")));
context.localmake("prevplotted?",true);
context.localmake("prevp", context.readVariable("pos2"));
context.turtle.jumpTo(context.readVariable("pos1"));`,
	'out': `context.turtle.setHeading(context.turtle.towards( context.readVariable("prevp")));
context.localmake("prevplotted?",true);
context.localmake("prevp", context.readVariable("pos2"));
context.turtle.jumpTo(context.readVariable("pos1"));`}
	];
	cases.forEach(function(caseInfo) {
		if (caseInfo.changed === false)
			caseInfo.out = caseInfo.in;
	});
	testInOutPairs(cases, optimizeVariableAccessInJavaScript, logger);
};