import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateTuringToWebLogo } from
'../../../../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

export function testTranslatePrints(logger) {
	const cases = [
		{
			'in': 'put "hello"', 'out': 'print "hello'
		},
		{
			'in': 'put "hello world"', 'out': 'print \'hello world\''
		},
		{
			'in': 'put 2+3', 'out': 'print 2 + 3'
		},
		{
			'in': 'put 2-3', 'out': 'print 2 - 3'
		},
		{
			'in': 'put 2*3', 'out': 'print 2 * 3'
		},
		{
			'in': 'put 2/3', 'out': 'print 2 / 3'
		},
		{
			'in': 'put 2**3', 'out': 'print power 2 3'
		},
		{
			'in': 'put 2+3*4', 'out': 'print 2 + 3 * 4'
		},
		{
			'in': 'put -x', 'out': 'print -:x'
		},
		{
			'in': 'put x<y', 'out': 'print :x < :y'
		},
		{
			'in': 'put x<=y', 'out': 'print :x <= :y'
		},
		{
			'in': 'put x=y', 'out': 'print :x = :y'
		},
		{
			'in': 'put x>y', 'out': 'print :x > :y'
		},
		{
			'in': 'put x>=y', 'out': 'print :x >= :y'
		},
		{
			'in': 'put not x', 'out': 'print not :x'
		},
		{
			'in': 'put x not= y', 'out': 'print :x <> :y'
		},
		{
			'in': 'put x and y', 'out': 'print and :x :y'
		},
		{
			'in': 'put x or y', 'out': 'print or :x :y'
		},
		{
			'in': 'put x shr y', 'out': 'print bitShiftRight :x :y'
		},
		{
			'in': 'put x shl y', 'out': 'print bitShiftLeft :x :y'
		},
		{
			'in': 'put "Please input an integer: " ..',
			'out': 'print \'Please input an integer: \''
			// copied from an example at:
			// https://handwiki.org/wiki/Turing_(programming_language)
		},
		{
			'in': 'put x,y', 'out': 'type :x\nprint :y'
		},
		{
			'in': 'put x,y,z', 'out': 'type :x\ntype :y\nprint :z'
		},
	];
	testInOutPairs(cases, translateTuringToWebLogo, logger);
};