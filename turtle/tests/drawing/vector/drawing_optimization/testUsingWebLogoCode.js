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
	{'code': 'rect 10 20', 'numShapes': 1, 'expectedFirstClass': 'PathShape'},
	{'code': 'roundRect 10 20 5', 'numShapes': 1, 'expectedFirstClass': 'PathShape'},
	{'code': 'arc 10 20', 'numShapes': 1, 'expectedFirstClass': 'ArcShape'},
	{'code': 'fd 10 jumpForward 2 fd 10', 'numShapes': 2, 'expectedFirstClass': 'LineSegmentShape'},
	{'code': 'fd 10 fd 20', 'numShapes': 1, 'analyzeCodeQuality': false, 'expectedFirstClass': 'LineSegmentShape'},
	{'code': 'fd 10 right 90 fd 20', 'numShapes': 1, 'expectedFirstClass': 'PathShape'},
	{'code': `setLineJoinStyle "miter
setLineCap "round
left 90
forward 10
forward 10
right 120
forward 10`, 'analyzeCodeQuality': false, 'numShapes': 1, 'expectedFirstClass': 'PathShape'}
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
		}
	});
};