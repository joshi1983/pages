import { optimizeVariableAccessInJavaScript } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimizeVariableAccessInJavaScript.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

function optimizeVariableAccessInJavaScriptWrapped(code) {
	return optimizeVariableAccessInJavaScript(code, true);
}

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
context.turtle.jumpTo(context.readVariable("pos1"));`},
	{'in': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let height = localVariables.get("height");
let arcinfo = localVariables.get("arcinfo");






arcinfo=context.list.item(context.repcount(), localVariables.get("arcs")) ;
context.turtle.jumpTo( localVariables.get("oldpos"));
context.turtle.jumpRight( height * context.list.item(1,arcinfo ) );
context.turtle.jumpForward( height * context.list.item(2,arcinfo ) );
context.turtle.right(context.list.item(3,arcinfo ));
localVariables. set("arcangle",context.list.item(4,arcinfo ));
localVariables. set("arcradius", height * context.list.item(5,arcinfo ) );
context.valueStack.push(localVariables. get("arcangle") < 0);


if (context.valueStack.pop()) {
context.turtle.arcLeft(- context.readVariable("arcangle") ,context.readVariable("arcradius"));
} else {
;
context.turtle.arcRight( localVariables.get("arcangle"), localVariables.get("arcradius"));
};
{
let repcountPair = context.repcountStack[context.repcountStack.length - 1];
repcountPair.current++;
context.valueStack.push(repcountPair.current <= repcountPair.max);
};

localVariables.set("arcinfo", arcinfo);`, 'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let arcangle = localVariables.get("arcangle");
let arcradius = localVariables.get("arcradius");
;
let height = localVariables.get("height");
let arcinfo = localVariables.get("arcinfo");






arcinfo=context.list.item(context.repcount(), localVariables.get("arcs")) ;
context.turtle.jumpTo( localVariables.get("oldpos"));
context.turtle.jumpRight( height * context.list.item(1,arcinfo ) );
context.turtle.jumpForward( height * context.list.item(2,arcinfo ) );
context.turtle.right(context.list.item(3,arcinfo ));
 arcangle=context.list.item(4,arcinfo ) ;
 arcradius= height * context.list.item(5,arcinfo ) ;
context.valueStack.push( arcangle < 0);


if (context.valueStack.pop()) {
context.turtle.arcLeft(-arcangle ,arcradius );
} else {
;
context.turtle.arcRight( arcangle , arcradius );
};
{
let repcountPair = context.repcountStack[context.repcountStack.length - 1];
repcountPair.current++;
context.valueStack.push(repcountPair.current <= repcountPair.max);
};

localVariables.set("arcinfo", arcinfo);
localVariables.set("arcangle", arcangle);
localVariables.set("arcradius", arcradius);`},
{'in': `context.make("scale",1);
context.valueStack.push(context.math.remainder(context.repcount(),2));
context.valueStack[context.valueStack.length - 1] = (context.valueStack[context.valueStack.length - 1] !== 0);
if (!context.valueStack.pop()) {
context.make("scale",1.2);
}
let scale = context.globalVariables.get("scale");
context.turtle.forward(100 * scale );
context.turtle.forward(5 * scale );
{
let repcountPair = context.repcountStack[context.repcountStack.length - 1];
repcountPair.current++;
context.valueStack.push(repcountPair.current <= repcountPair.max);
};`,

'out': `let scale = context.readVariable("scale");
scale=1 ;
context.valueStack.push(context.math.remainder(context.repcount(),2));
context.valueStack[context.valueStack.length - 1] = (context.valueStack[context.valueStack.length - 1] !== 0);
if (!context.valueStack.pop()) {
 scale=1.2 ;
}

context.turtle.forward(100 * scale );
context.turtle.forward(5 * scale );
{
let repcountPair = context.repcountStack[context.repcountStack.length - 1];
repcountPair.current++;
context.valueStack.push(repcountPair.current <= repcountPair.max);
};
context.make("scale", scale);`},
	{'in': `if (!(context.readVariable("colorindex") > 0)) {
context.localmake("colorindex", context.getCurrentExecutingProcedure().localVariables.get("colorindex") + 1);
}
let colorindex = context.getCurrentExecutingProcedure().localVariables.get("colorindex");
context.turtle.setFillColor(this.convertToAlphaColourOrTransparent(context.list.item(colorindex ,context.globalVariables.get("colors"))));
context.valueStack.push(context.readVariable("size") * 0.38197);
context.valueStack.push(colorindex - 1);`,

'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let colorindex = context.readVariable("colorindex");
if (!(colorindex > 0)) {
 colorindex=colorindex + 1 ;
}

context.turtle.setFillColor(this.convertToAlphaColourOrTransparent(context.list.item(colorindex ,context.globalVariables.get("colors"))));
context.valueStack.push(context.readVariable("size") * 0.38197);
context.valueStack.push(colorindex - 1);
localVariables.set("colorindex", colorindex);`},
{'in': `context.make("x",1);
context.localmake("x",2);`,
// We don't want to change this because this could be setting a global x 
// variable to 1 and a local x variable to 2.
// We don't want to change this in a way that could change that effect.
'changed': false
},
{'in': `context.make("treadcolor","black");
context.make("framecolor","skyBlue");
context.make("frameshadecolor",context.math.mix(context.globalVariables.get("framecolor"),"black",0.6));
context.make("seatcolor","black");`,
'changed': false
}
	];
	testInOutPairs(cases, optimizeVariableAccessInJavaScriptWrapped, logger);
};