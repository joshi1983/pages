import { CircleShape } from
'../../../../../modules/drawing/vector/shapes/CircleShape.js';
import { Colour } from
'../../../../../modules/Colour.js';
import { LineSegmentShape } from
'../../../../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { PathShape } from
'../../../../../modules/drawing/vector/shapes/PathShape.js';
import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecute(logger) {
	const cases = [
		{'code': 'fcolor 255,0,0\nrect 1,2,3,4',
			'messages': [],
			'drawingCheck': function(drawing, logger) {
			const shapes = drawing.getShapesArray();
			if (shapes.length !== 1)
				logger(`Expected 1 shape but found ${shapes.length}`);
			else {
				const shape = shapes[0];
				if (!(shape instanceof PathShape)) {
					logger(`Expected a PathShape but found ${shape}`);
				}
				else if (!shape.isClosed)
					logger(`Expected isClosed to be true but found ${shape.isClosed}`);
				const style = shape.style;
				const fcolor = style.getFillColor();
				if (!fcolor.equals(new Colour(255, 0, 0)))
					logger(`Expected a fill color of red(255, 0, ) but found ${fcolor}`);
			}
		}},
		{'code': 'wcolor 255,0,0',
			'messages': [],
			'drawingCheck': function(drawing, logger) {
			const shapes = drawing.getShapesArray();
			if (shapes.length !== 0)
				logger(`Expected 0 shape but found ${shapes.length}`);
			
			const screenColor = drawing.screenColor;
			if (!screenColor.equals(new Colour(255, 0, 0)))
				logger(`Expected a screen color of red(255, 0, ) but found ${screenColor}`);
		}},
		{'code': 'line 1,2,3,4',
			'messages': [],
			'drawingCheck': function(drawing, logger) {
			const shapes = drawing.getShapesArray();
			if (shapes.length !== 1)
				logger(`Expected 1 shape but found ${shapes.length}`);
			else {
				const shape = shapes[0];
				if (!(shape instanceof LineSegmentShape)) {
					logger(`Expected a LineSegmentShape but found ${shape}`);
				}
			}
		}},
		{'code': 'circle 1,2,3',
			'messages': [],
			'drawingCheck': function(drawing, logger) {
				const shapes = drawing.getShapesArray();
				if (shapes.length !== 1)
					logger(`Expected 1 shape but found ${shapes.length}`);
				else {
					const shape = shapes[0];
					if (!(shape instanceof CircleShape)) {
						logger(`Expected a CircleShape but found ${shape}`);
					}
				}
			}
		},
		{'code': 'print 1<2', 'messages': ['true']},
		{'code': 'print 1<1', 'messages': ['false']},
		{'code': 'print 2<1', 'messages': ['false']},
		{'code': 'print !true', 'messages': ['false']},
		{'code': 'print !false', 'messages': ['true']},
		{'code': 'print false&true', 'messages': ['false']},
		{'code': 'print true&false', 'messages': ['false']},
		{'code': 'print true&true', 'messages': ['true']},
		{'code': 'print false&false', 'messages': ['false']},
		{'code': 'print false|true', 'messages': ['true']},
		{'code': 'print true|false', 'messages': ['true']},
		{'code': 'print true|true', 'messages': ['true']},
		{'code': 'print false|false', 'messages': ['false']},
	];
	processTranslateExecuteCases(cases, logger);
};