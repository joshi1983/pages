import { optimizeJS } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimizeJS.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

function optimizeJSWrapped(code) {
	return optimizeJS(code, true);
}

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
	{'in': `context.localmake("oldpos",context.turtle.pos());
context.localmake("oldheading",context.turtle.heading());
context.localmake("size1",(context.getCurrentExecutingProcedure().localVariables.get("size")) * 0.5);
context.localmake("thickness",(context.getCurrentExecutingProcedure().localVariables.get("size")) * (context.globalVariables.get("thicknessratio")));
context.localmake("size2",(context.getCurrentExecutingProcedure().localVariables.get("thickness")) / (context.math.cos(context.getCurrentExecutingProcedure().localVariables.get("growthangle"))));
context.localmake("size3",(context.getCurrentExecutingProcedure().localVariables.get("size")) + (((context.getCurrentExecutingProcedure().localVariables.get("size2")) * 2) * (context.math.sin(context.getCurrentExecutingProcedure().localVariables.get("growthangle")))));
context.turtle.left(90);
context.turtle.forward(context.getCurrentExecutingProcedure().localVariables.get("size1"));
context.turtle.polyStart();
context.turtle.right(90 - (context.getCurrentExecutingProcedure().localVariables.get("growthangle")));
context.turtle.forward(context.getCurrentExecutingProcedure().localVariables.get("size2"));
context.turtle.right(90 + (context.getCurrentExecutingProcedure().localVariables.get("growthangle")));
context.turtle.forward(context.getCurrentExecutingProcedure().localVariables.get("size3"));
context.turtle.right(90 + (context.getCurrentExecutingProcedure().localVariables.get("growthangle")));
context.turtle.forward(context.getCurrentExecutingProcedure().localVariables.get("size2"));
context.turtle.polyEnd();
context.turtle.setPos(context.getCurrentExecutingProcedure().localVariables.get("oldpos"));
context.turtle.setHeading(context.getCurrentExecutingProcedure().localVariables.get("oldheading"));`,
'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let size2 = localVariables.get("size2");
let size = localVariables.get("size");
let growthangle = localVariables.get("growthangle");
localVariables. set("oldpos",context.turtle.pos());
localVariables. set("oldheading",context.turtle.heading());
localVariables. set("size1", size * 0.5);
localVariables. set("thickness", size * context.globalVariables.get("thicknessratio") );
size2= localVariables.get("thickness") / context.math.cos(growthangle ) ;
localVariables. set("size3", size + (( size2 * 2) * context.math.sin(growthangle ) ));
context.turtle.left(90);
context.turtle.forward( localVariables.get("size1"));
context.turtle.polyStart();
context.turtle.right(90 - growthangle );
context.turtle.forward( size2 );
context.turtle.right(90 + growthangle );
context.turtle.forward( localVariables.get("size3"));
context.turtle.right(90 + growthangle );
context.turtle.forward( size2 );
context.turtle.polyEnd();
context.turtle.setPos( localVariables.get("oldpos"));
context.turtle.setHeading( localVariables.get("oldheading"));
localVariables.set("size2", size2);`},
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

localVariables.set("arcinfo", arcinfo);`,

'out': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
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
context.valueStack.push(context.readVariable("size") * 0.38197,colorindex - 1);
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
},
{'in': `context.valueStack[context.valueStack.length - 0] = context.repcount();
context.valueStack[context.valueStack.length - 1] = context.valueStack[context.valueStack.length - 1] - 1 ;
context.valueStack[context.valueStack.length - 1] = context.valueStack[context.valueStack.length - 1] / 2 ;`,
'out': `context.valueStack[context.valueStack.length - 0] = context.repcount();
context.valueStack[context.valueStack.length - 1] = (context.valueStack[context.valueStack.length - 1] - 1)/2
;`
}
	];
	testInOutPairs(cases, optimizeJSWrapped, logger);
};