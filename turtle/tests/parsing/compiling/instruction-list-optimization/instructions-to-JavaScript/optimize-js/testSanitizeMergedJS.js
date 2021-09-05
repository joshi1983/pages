import { sanitizeMergedJS } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/sanitizeMergedJS.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testSanitizeMergedJS(logger) {
	const cases = [
	{'in': '', 'out': ''},
	{'in': `let x = context.readVariable("x");
context.turtle.print( x );
x= x + 1 ;
context.valueStack.push(context.readVariable("x") < 3);
context.make("x", x);`, 'out': `let x = context.readVariable("x");
context.turtle.print( x );
x= x + 1 ;
context.valueStack.push( x < 3);
context.make("x", x);`
	},
	{'in': `let x = context.readVariable("x");
let x2 = context.readVariable("x");
context.turtle.print(x2)`,
'out': `let x = context.readVariable("x");

context.turtle.print( x)`},
	{'in': 'context.turtle.setPenSize(this.validateNumber(this.errorCaseCheck6(0)))',
	'out': 'context.turtle.setPenSize(this.validateNumber(this.errorCaseCheck6(0)))'},
	{'in': 'context.turtle.setPenColor(this.convertToAlphaColourOrTransparent(context.globalVariables.get("seatcolor")))',
	'out': 'context.turtle.setPenColor(this.convertToAlphaColourOrTransparent(context.globalVariables.get("seatcolor")))'},
	{'in': `context.valueStack.pop();
context.turtle.setPenColor(this.convertToAlphaColourOrTransparent(context.globalVariables.get("seatcolor")));
context.turtle.setPenSize((context.getCurrentExecutingProcedure().localVariables.get("size")) * 0.024);
context.turtle.forward((context.getCurrentExecutingProcedure().localVariables.get("size")) * 0.1);
context.turtle.arcLeft(67,(context.getCurrentExecutingProcedure().localVariables.get("size")) * 0.1);
context.turtle.forward((context.getCurrentExecutingProcedure().localVariables.get("size")) * 0.05);
context.turtle.right(175);
context.turtle.forward((context.getCurrentExecutingProcedure().localVariables.get("size")) * 0.15);
context.turtle.setPenSize(0);
context.turtle.setFillColor(this.convertToAlphaColourOrTransparent(context.globalVariables.get("seatcolor")));`,
	'out': `context.valueStack.pop();
context.turtle.setPenColor(this.convertToAlphaColourOrTransparent(context.globalVariables.get("seatcolor")));
context.turtle.setPenSize((context.getCurrentExecutingProcedure().localVariables.get("size")) * 0.024);
context.turtle.forward((context.getCurrentExecutingProcedure().localVariables.get("size")) * 0.1);
context.turtle.arcLeft(67,(context.getCurrentExecutingProcedure().localVariables.get("size")) * 0.1);
context.turtle.forward((context.getCurrentExecutingProcedure().localVariables.get("size")) * 0.05);
context.turtle.right(175);
context.turtle.forward((context.getCurrentExecutingProcedure().localVariables.get("size")) * 0.15);
context.turtle.setPenSize(0);
context.turtle.setFillColor(this.convertToAlphaColourOrTransparent(context.globalVariables.get("seatcolor")));`},
	{'in': `context.make("animationratio",1);
context.valueStack.push(context.readVariable("animationratio") <= 0.5);
if (!context.valueStack.pop()) {
context.make("animationratio",1 - context.globalVariables.get("animationratio") );
};
let animationratio = context.readVariable("animationratio");
animationratio= animationratio * 2 ;
context.turtle.print(animationratio );
context.make("animationratio", animationratio);`,
	'out': `let animationratio = context.readVariable("animationratio");
animationratio=1 ;
context.valueStack.push( animationratio <= 0.5);
if (!context.valueStack.pop()) {
animationratio=1 - animationratio ;
}

animationratio= animationratio * 2 ;
context.turtle.print(animationratio );
context.make("animationratio", animationratio);`},
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


localVariables. set("radius",context.math.mix( localVariables.get("maxradius"), localVariables.get("minradius"),( column - 1) / 5));
numintervals= column - 1 ;
context.valueStack.push( numintervals <= 2);

if (!context.valueStack.pop()) {
numintervals=4 - numintervals ;
}



localVariables. set("totalintervals",( numintervals * 2) + 1);
localVariables. set("pos1",context.turtle.pos());
context.turtle.jumpForward( numintervals * localVariables.get("vseparation") );
context.valueStack.push(localVariables. get("totalintervals"));
localVariables.set("numintervals", numintervals);`},
	{'in': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
if (!context.valueStack.pop()) {
let tinysize1 = localVariables.get("tinysize1");
context.turtle.jumpBackward( tinysize1 * 0.5);
}
context.turtle.jumpForward( tinysize1 * 2);`,
	'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let tinysize1 = localVariables.get("tinysize1");

if (!context.valueStack.pop()) {
;
context.turtle.jumpBackward( tinysize1 * 0.5);
}
context.turtle.jumpForward( tinysize1 * 2);`},
	{'in': `context.make("pos2",context.turtle.pos());
context.valueStack.push(context.math.not(context.globalVariables.get("prevplotted?")));
if (!context.valueStack.pop()) {
let prevp = context.globalVariables.get("prevp");
context.turtle.setHeading(context.turtle.towards( prevp ));
context.turtle.forward(context.turtle.distance( prevp ));
};
context.make("prevplotted?",true);
context.make("prevp",context.globalVariables.get("pos2"));`,
	'out': `let prevp = context.globalVariables.get("prevp");
context.make("pos2",context.turtle.pos());
context.valueStack.push(context.math.not(context.globalVariables.get("prevplotted?")));
if (!context.valueStack.pop()) {
;
context.turtle.setHeading(context.turtle.towards( prevp ));
context.turtle.forward(context.turtle.distance( prevp ));
}
context.make("prevplotted?",true);
context.make("prevp",context.globalVariables.get("pos2"));`},
	{'in': `context.make("animationratio",1);
context.valueStack.push(context.readVariable("animationratio") <= 0.5);
if (!context.valueStack.pop()) {
context.make("animationratio",1 - context.globalVariables.get("animationratio") );
};
let animationratio = context.readVariable("animationratio");
animationratio= animationratio * 2 ;
context.turtle.print(animationratio );
context.make("animationratio", animationratio);"`,
'out': `let animationratio = context.readVariable("animationratio");
animationratio=1 ;
context.valueStack.push( animationratio <= 0.5);
if (!context.valueStack.pop()) {
animationratio=1 - animationratio ;
}

animationratio= animationratio * 2 ;
context.turtle.print(animationratio );
context.make("animationratio", animationratio);"`},
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
localVariables.set("arcinfo", arcinfo);
const localVariables = context.getCurrentExecutingProcedure().localVariables;
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
};`, 'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
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
localVariables.set("arcinfo", arcinfo);`},
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
}

context.turtle.setFillColor(this.convertToAlphaColourOrTransparent(context.list.item(colorindex ,context.globalVariables.get("colors"))));
context.valueStack.push(context.readVariable("size") * 0.38197);
context.valueStack.push(colorindex - 1);
context.localmake("colorindex", colorindex);`}
	];
	testInOutPairs(cases, sanitizeMergedJS, logger);
};