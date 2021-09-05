import { createRootToken } from
'../../../../../../helpers/createRootToken.js';
import { JavaScriptInstruction } from
'../../../../../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { optimizeWithConstantColours } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/final-optimize/optimizeWithConstantColours.js';
import { ParseTreeTokenType } from
'../../../../../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';
import { testInOutPairs } from
'../../../../../../helpers/testInOutPairs.js';

function wrappedOptimizeWithConstantColours(jsCode, colourNames, logger) {
	const mockToken = createRootToken();
	const instruction = new JavaScriptInstruction(jsCode, mockToken);
	optimizeWithConstantColours(instruction);
	if (colourNames instanceof Array) {
		colourNames.forEach(function(name) {
			if (typeof instruction[name] !== 'object')
				logger(`Expected ${name} to be a Colour or AlphaColour but got ${instruction[name]}`);
		});
	}
	return instruction.code;
}

export function testOptimizeWithConstantColours(logger) {
	const cases = [
	{'in': '', 'changed': false},
	{'in': 'context.turtle.setPenSize(4)', 'changed': false},
	{'in': 'context.turtle.setPenColor(this.convertToAlphaColourOrTransparent())',
	// not enough parameters.  Weird case but want to make sure this doesn't cause weird errors anyway.
	'changed': false},
	{'inArgs': ['context.turtle.setPenColor(this.convertToAlphaColourOrTransparent("black"))', ['COLOR_BLACK']],
	'out': `context.turtle.setPenColor(this. COLOR_BLACK )`,
	},
	{'inArgs': ['context.turtle.setPenColor(this.convertToColourOrTransparent("black"))', ['COLOR_BLACK']],
	'out': `context.turtle.setPenColor(this. COLOR_BLACK )`
	},
	{'inArgs': ['context.turtle.setPenColor(this.convertToColourOrTransparent([0,0,0]))', 'COLOR_000000'],
	'out': `context.turtle.setPenColor(this. COLOR_000000 )`
	},
	{'inArgs': [`context.turtle.setPenColor(this.convertToColourOrTransparent("black"));
context.turtle.setPenColor(this.convertToAlphaColourOrTransparent("#000"))`, ['COLOR_BLACK']],
	'out': `context.turtle.setPenColor(this. COLOR_BLACK );
context.turtle.setPenColor(this. COLOR_BLACK )`
	},
	{'inArgs': [`context.turtle.setPenColor(this.convertToColourOrTransparent([0,0,0]));
context.turtle.setPenColor(this.convertToAlphaColourOrTransparent("#000"))`, ['COLOR_000000']],
	'out': `context.turtle.setPenColor(this. COLOR_000000 );
context.turtle.setPenColor(this. COLOR_000000 )`
	},
	{'inArgs': [`context.turtle.setPenColor(this.convertToColourOrTransparent("black"));
context.turtle.print("black")`, ['COLOR_BLACK']],
	'out': `context.turtle.setPenColor(this. COLOR_BLACK );
context.turtle.print("black")`,
	},
	];
	cases.forEach((caseInfo, index) => {
		if (caseInfo.inArgs instanceof Array && caseInfo.inArgs.length === 2)
			caseInfo.inArgs.push(prefixWrapper(`Case ${index}`, logger));
	});
	testInOutPairs(cases, wrappedOptimizeWithConstantColours, logger);
};