import { compileOptionsArray } from '../../../parsing/execution/compileOptionsArray.js';
import { createTestTurtle } from '../../../helpers/createTestTurtle.js';
import { LogoProgramExecuter } from '../../../../modules/parsing/execution/LogoProgramExecuter.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testCodeToProgram } from '../../../helpers/testCodeToProgram.js';

export function testUsingWebLogoCode(logger) {
	const cases = [
	{'code': '', 'numShapes': 0},
	{'code': 'fd 10', 'numShapes': 1, 'expectedFirstClass': 'LineSegmentShape'},
	{'code': 'circle 10', 'numShapes': 1, 'expectedFirstClass': 'CircleShape'},
	{'code': 'ellipse 10 20', 'numShapes': 1, 'expectedFirstClass': 'EllipseShape'},
	{'code': 'rect 10 20', 'numShapes': 1, 'expectedFirstClass': 'PathShape', 'firstNumElements': 4},
	{'code': 'roundRect 10 20 5', 'numShapes': 1, 'expectedFirstClass': 'PathShape'},
	{'code': 'arc 10 20', 'numShapes': 1, 'expectedFirstClass': 'ArcShape'},
	{'code': 'fd 10 jumpForward 2 fd 10', 'numShapes': 2, 'expectedFirstClass': 'LineSegmentShape'},
	{'code': 'fd 10 fd 20', 'numShapes': 1, 'analyzeCodeQuality': false, 'expectedFirstClass': 'LineSegmentShape'},
	{'code': 'fd 10 preventPathJoin fd 20', 'numShapes': 2, 'expectedFirstClass': 'LineSegmentShape'},
	{'code': 'arcLeft 10 10 preventPathJoin fd 20', 'numShapes': 2, 'expectedFirstClass': 'ArcShape'},
	{'code': 'arcLeft 10 10 fd 20 preventPathJoin fd 20', 'numShapes': 2, 'expectedFirstClass': 'PathShape'},
	{'code': 'arc 10 10 preventPathJoin fd 20', 'numShapes': 2, 'expectedFirstClass': 'ArcShape'},
	{'code': 'fd 10 right 90 preventPathJoin fd 20', 'numShapes': 2, 'expectedFirstClass': 'LineSegmentShape'},
	{'code': 'fd 10 right 90 fd 20', 'numShapes': 1, 'expectedFirstClass': 'PathShape', 'firstNumElements': 3},
	{'code': `setLineJoinStyle "miter
setLineCap "round
left 90
forward 10
forward 10
right 120
forward 10`, 'analyzeCodeQuality': false, 'numShapes': 1, 'expectedFirstClass': 'PathShape'},
	{'code': `setMiterLimit 1000
setPenSize 1
setLineCap "butt
setLineJoinStyle "miter
arcLines [
		[0.07] [-80 0] [0.037] [-120 0] [20 0.2234517]
	] 100`, 'numShapes': 1, 'expectedFirstClass': 'PathShape',
	'firstNumElements': 3}
	];
	const compileOptions = compileOptionsArray[compileOptionsArray.length - 1];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		let analyzeCodeQuality = true;
		if (caseInfo.analyzeCodeQuality !== undefined)
			analyzeCodeQuality = caseInfo.analyzeCodeQuality;
		const program = testCodeToProgram(caseInfo.code, plogger, compileOptions, analyzeCodeQuality);
		const turtle = createTestTurtle();
		const executer = new LogoProgramExecuter(turtle, program);
		const numInstructions = 200;
		executer.executeInstructionsSync(numInstructions);
		const shapes = turtle.drawing.getShapesArray();
		if (shapes.length !== caseInfo.numShapes)
			plogger(`Expected number of shapes to be ${caseInfo.numShapes} but found ${shapes.length}`);
		else if (shapes.length > 0 && caseInfo.expectedFirstClass !== undefined) {
			const firstShape = shapes[0];
			const firstShapeClassName = firstShape.constructor.name;
			if (firstShapeClassName !== caseInfo.expectedFirstClass)
				plogger(`Expected class name to be ${caseInfo.expectedFirstClass} but found ${firstShapeClassName}`);
			if (caseInfo.firstNumElements !== undefined) {
				if (!(firstShape.elements instanceof Array))
					plogger(`firstNumElements was expected to be ${caseInfo.firstNumElements} but the first shape doesn't even have an elements property.`);
				else if (firstShape.elements.length !== caseInfo.firstNumElements)
					plogger(`firstNumElements was expected to be ${caseInfo.firstNumElements} but firstShape.elements.length = ${firstShape.elements.length}.`);
			}
		}
	});
};