import { compareCanvasAndSVGFromDrawing } from './compareCanvasAndSVGFromDrawing.js';
import { createDrawingFromCode } from '../../helpers/createDrawingFromCode.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

const roundedRectProc = `to roundedRectangle :width :height :cornerRadius
	localmake "oldState turtleState
	localmake "width1 :width - :cornerRadius * 2
	localmake "height1 :height - :cornerRadius * 2
	jumpRight :cornerRadius
	right 90
	polyStart
	repeat 2 [
		forward :width1
		ArcLeft 90 :cornerRadius
		forward :height1
		ArcLeft 90 :cornerRadius
	]
	polyEnd
	setTurtleState :oldState
end
`;
const getGradientProc = `to getGradient
	localmake "oldPos pos
	localmake "colorStops createPList
	setProperty "colorStops 0 "red
	setProperty "colorStops 1 "blue
	localmake "fromPos pos
	jumpForward 100
	localmake "result createLinearGradient :fromPos pos :colorStops "pad
	jumpTo :oldPos
	output :result
end
`;

export function testCanvasAndSVGLooksSameWithCode(logger) {
	const cases = [
		'fd 50',
		'setPenSize 15\nfd 50',
		'setPenSize 15\nrepeat 3 [\nfd 50\nright 90\n]\nclosePath',
		'setPenSize 15\nrepeat 4 [\nfd 50\nright 90\n]\nclosePath',
		'setFillColor "red\nsetPenSize 10\npolyStart\nrepeat 4 [\nfd 50\nright 90\n]\npolyEnd',
		{'code': 'right 20\nsetFillColor "red\nsetPenSize 15\npolyStart\nrepeat 4 [\nfd 50\nright 90\n]\npolyEnd',
		'threshold': 0.0004},
		'right 10\nsetFillColor "red\nsetPenSize 0\npolyStart\nrepeat 4 [\nfd 50\nright 90\n]\npolyEnd',
		'right 10\nsetPenSize 15\nfd 50',
		{'code': 'setPenSize 20\narcRight 90 100', 'threshold': 0.0006},
		{'code': 'setPenSize 20\narcLeft 90 100', 'threshold': 0.0007},
		'setLineCap "round\nsetPenSize 15\nfd 50',
		'setLineCap "butt\nsetPenSize 15\nfd 50',
		'setLineCap "square\nsetPenSize 15\nfd 50',
		'setLineCap "round\nsetPenSize 15\nfd 20\narcRight 90 10',
		'setLineCap "butt\nsetPenSize 15\nfd 20\narcRight 90 10',
		'setLineCap "square\nsetPenSize 15\nfd 20\narcRight 90 10',
		{'code': `setPenSize 25
repeat 4 [
	arcRight 90 20
		forward 20
		]`,
		'threshold': 0.00065
		},
		{'code': `setPenSize 25
repeat 4 [
	arcLeft 90 20
		forward 20
		]`,
		'threshold': 0.00065
		},
		{'code': `setPenSize 25
repeat 3 [
	arcRight 90 20
		forward 20
		]\nclosePath`, 'threshold': 0.0004},
		{'code': `setPenSize 25
repeat 3 [
		forward 20
	arcRight 90 20
		]\nclosePath`, 'threshold': 0.0003},
		{'code': `setFillColor "red
make "r 10
circle 20
setPenSize 0
polyStart
jumpforward 50
arcleft 90 :r
jumpForward 100
arcLeft 90 :r
jumpForward 50
arcleft 90 :r
jumpForward 100
arcleft 90 :r
setPenSize 1
		polyEnd`, 'threshold': 0.0003},
		{
			'code': roundedRectProc + '\nsetPenSize 5\nroundedRectangle 50 100 15',
			'threshold': 0.0003
		},
		roundedRectProc + getGradientProc + '\nsetFillGradient getGradient\nsetPenSize 5\nroundedRectangle 50 100 15',
		{'code': roundedRectProc + getGradientProc + '\nsetFillGradient getGradient\nright 30\nsetPenSize 5\nroundedRectangle 50 100 15',
		'threshold': 0.0005},
		{
			//If this test case ever fails, also manually test with an example called 
			//"Mohamed Sewelam Logo".
			//This test case code is basically a simplified version of that example.
			'code': `make "height 100
make "radius1 :height / 2
make "radius3 :height / 5
make "radius2 (:radius1 + :radius3) / 2

jumpForward :radius1
make "center pos
jumpRight :radius1
setPenSize 0
setFillColor "red
polyStart
arcLeft 360 :radius1
right 180
arcRight 360 :radius2
polyEnd

jumpTo :center
setHeading 45
jumpForward :height * 0.1
setFillColor "blue
jumpTo :center
setHeading 0
jumpRight :radius1 - :radius2 * 2
polyStart
arcRight 360 :radius3
right 180
arcLeft 360 :radius2
polyEnd`,
		'threshold': 0.0008
		},
		{
			'code': 'setPenSize 5\nroundRect 30 50 15',
			'threshold': 0.00025
		},
		{
			'code': 'setPenSize 5\nroundRect 50 30 15',
			'threshold': 0.0003
		},
		{
			'code': `to devCycleLogo :height
	localmake "width1 :height * 1.14
	localmake "height1 :height * 0.66
	roundRect :width1 :height1 :height1 / 2
end

setPenSize 5
circle 10
roundRect 57 33 16.5
devCycleLogo 50`,
			'threshold': 0.00065
		},
		{
			'code': `; Inspired by
; https://en.wikipedia.org/wiki/Square_(financial_services)#/media/File:Square_(Block,_Inc.)_Logo_08.2022.svg
to squareUpLogo :height
	localmake "oldState turtleState
	localmake "gradient1 fillGradient
	localmake "squaresInfo [
		[1 0.5] [0.63 0.315] [0.27 0.032]
	]
	setPenSize 0
	jumpForward :height / 2
	repeat count :squaresInfo [
		localmake "squareInfo item repcount :squaresInfo
		setFillColor ifelse even? repcount
			"white
			"black
		if even? repcount [
			setFillGradient :gradient1
		]
		localmake "squareSize :height * first :squareInfo
		localmake "cornerRadius :height * last :squareInfo
		roundRect :squareSize :squareSize :cornerRadius
	]
	setTurtleState :oldState
end


make "colorStops createPList
setProperty "colorStops 0 "red
setProperty "colorStops 0.5 "blue
setProperty "colorStops 1 "yellow
setFillGradient createRadialGradient pos 100 :colorStops
right 20
squareUpLogo 100`,
			'threshold': 0.0007
		},

		{'code': `make "colorStops createPList
setProperty "colorStops 0 "red
setProperty "colorStops 1 "black
setFillGradient createRadialGradient2 pos pos 10 :colorStops "repeat
circle 100`, 'threshold': 0.0031},

		{'code': `make "colorStops createPList2 [[0 "red] [1 "black]]
setFillGradient createRadialGradient2 pos pos 10 :colorStops "repeat
circle 100`, 'threshold': 0.0031}, 
// same as previous case but just want to try some refactored code for the property list.

		{'code': `make "radius 100
make "arcAngle 70
make "innerPeddleArcs [
	[:arcAngle / 2 0] [-:arcAngle 0.58] [(:arcAngle - 180) / 2 0]
]
setPenSize 0
setFillColor "blue
polyStart
arcLines :innerPeddleArcs :radius
arcLines reverse :innerPeddleArcs :radius
polyEnd`},
{'code': `left 90
setPenSize 5
forward 51
arcLeft 50 20

jumpTo [0 0]
setHeading -60	
forward 51
arcLeft 90 20`, 'threshold': 0.0003}
	];
	const pixelGap = 2;
	const defaultThreshold = 0.00025;
	cases.forEach(async function(caseInfo, index) {
		if (typeof caseInfo === 'string') {
			caseInfo = {
				'code': caseInfo
			};
		}
		if (caseInfo.pixelGap === undefined)
			caseInfo.pixelGap = pixelGap;
		if (caseInfo.threshold === undefined)
			caseInfo.threshold = defaultThreshold;
		const code = caseInfo.code;
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		const drawing = createDrawingFromCode(code, plogger);
		await compareCanvasAndSVGFromDrawing(drawing, caseInfo.threshold, caseInfo.pixelGap, plogger);
	});
};