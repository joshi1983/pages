import { processDenoiseTestCases } from './processDenoiseTestCases.js';
import { valueAssignedDenoiser } from '../../../../modules/parsing/parse-tree-analysis/denoising/valueAssignedDenoiser.js';

export function testValueAssignedDenoiser(logger) {
	const cases = [
	{
		'code': 'make "x 4',
		'removeCount': 0
	},
	{
		'code': `to p
	localmake "stripeThickness1
	penUp
end`, 'removeCount': 1
	},{
		'code': `to p
	localmake "stripeThickness1
	setPenSize 0
end`, 'removeCount': 1
	},{
		'code': `make "stripeThickness1
	penUp`, 'removeCount': 1
	},	{
		'code': `to p
	localmake "stripeThickness1
	penUp
	repeat 4 [
		jumpLeft :stripeThickness1
	]
end`, 'removeCount': 2
	},	{
		'code': `make "stripeThickness1
	penUp
	repeat 4 [
		jumpLeft :stripeThickness1
	]`, 'removeCount': 2
	},
	{
		'code': `to p
	localmake "stripeThickness1
	penUp
	print 4 + :stripeThickness1
end`, 'removeCount': 2
	},
	{
		'code': `to p
	localmake "stripeThickness1
	penUp
	print -:stripeThickness1
end`, 'removeCount': 2
	},
	{
		'code': `to p
end

to liberiaFlag :height
	localmake "width :height * 2
	localmake "starWidth 
	p
	jumpLeft (:width - :starWidth)
end`, 'removeCount': 1
	}
	];
	processDenoiseTestCases(cases, valueAssignedDenoiser, logger);
};