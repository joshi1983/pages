import { formatCode } from '../../../../modules/components/code-editor/format/formatCode.js';
import { getStringComparisonDetails } from '../../../helpers/getStringComparisonDetails.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testFormatCode(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'fd 100', 'out': 'fd 100'},
		{'in': 'fd\n100', 'out': 'fd 100'},
		{'in': 'fd 10 + 20', 'out': 'fd 10 + 20'},
		{'in': 'fd (10 + 20)', 'out': 'fd ( 10 + 20 )'},
		{'in': 'fd (sum 10 20 50)', 'out': 'fd ( sum 10 20 50 )'},
		{'in': 'fd 100 right 90', 'out': 'fd 100\nright 90'},
		{'in': 'make "x 1 print -:x', 'out': 'make "x 1\nprint -:x'},
		{'in': 'make "x 1 print -(:x + 1)', 'out': 'make "x 1\nprint -( :x + 1 )'},
		{'in': 'pendown;comment\n penup', 'out': 'pendown\n;comment\npenup'},
		{'in': 'fd 100;comment\n right 90', 'out': 'fd 100\n;comment\nright 90'},
		{'in': '; some comment\nfd 100', 'out': '; some comment\nfd 100'},
		{'in': '; some comment\nfd 100;another comment', 'out': '; some comment\nfd 100\n;another comment'},
		{'in': 'while true [fd 100 right 90]', 'out': 'while true [\n\tfd 100\n\tright 90\n]'},
		{'in': 'forever [fd 100 right 90]', 'out': 'forever [\n\tfd 100\n\tright 90\n]'},
		{'in': 'for ["x 0 5 1] [ print :x ]', 'out': 'for [ "x 0 5 1 ] [\n\tprint :x\n]'},
		{'in': 'repeat 4 [fd 100 right 90]', 'out': 'repeat 4 [\n\tfd 100\n\tright 90\n]'},
		{'in': 'repeat 4 [ ;comment\nfd 100 right 90]', 'out': 'repeat 4 [\n\t;comment\n\tfd 100\n\tright 90\n]'},
		{'in': 'repeat 2 [repeat 2 [fd 100 right 90]]', 'out': 'repeat 2 [\n\trepeat 2 [\n\t\tfd 100\n\t\tright 90\n\t]\n]'},
		{'in': 'to p\nend', 'out': 'to p\nend'},
		{'in': 'to p\nend fd 100', 'out': 'to p\nend\n\nfd 100'},
		{'in': 'to p :param1 :param2\nend fd 100', 'out': 'to p :param1 :param2\nend\n\nfd 100'},
		{'in': 'to p :McDonalds :TimHortons\nend fd 100', 'out': 'to p :McDonalds :TimHortons\nend\n\nfd 100'},
		{'in': 'to BobSmith :McDonalds :TimHortons\nend fd 100', 'out': 'to BobSmith :McDonalds :TimHortons\nend\n\nfd 100'},
		{'in': 'fd 50 to p\nend fd 100', 'out': 'fd 50\n\nto p\nend\n\nfd 100'},
		{'in': 'fd 50 ;c1\nto p\nend;c2\nfd 100', 'out': 'fd 50\n\n;c1\nto p\nend\n\n;c2\nfd 100'},
		{'in': '; a procedure\nto p1\nend p1', 'out': '; a procedure\nto p1\nend\n\np1'},
		{'in': 'to p\nprint "Hello end', 'out': 'to p\n\tprint "Hello\nend'},
		{'in': 'to p\nrepeat 4[print "Hello] end', 'out': 'to p\n\trepeat 4 [\n\t\tprint "Hello\n\t]\nend'},
		{'in': ';proc1 comment\nto p\n;loop comment\nrepeat 4[ ; print stuff\nprint "Hello] end', 
			'out': ';proc1 comment\nto p\n\t;loop comment\n\trepeat 4 [\n\t\t; print stuff\n\t\tprint "Hello\n\t]\nend'},
		{'in': 'print (sum 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12 + 13 + 14 + 15 + 16 + 17 + 18 + 19 + 20)',
			'out': 'print ( sum 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12 +\n13 + 14 + 15 + 16 + 17 + 18 + 19 + 20 )'},
		{'in': 'to', 'out': 'to\nend'},
		{'in': 'to\n', 'out': 'to'},
		{'in': 'to  ', 'out': 'to\nend'},
		{'in': 'print -', 'out': 'print -'}
	];
	cases.forEach(function(caseInfo, index) {
		const s = formatCode(caseInfo.in);
		const plogger = prefixWrapper('Case ' + index + ', input code is: "' + caseInfo.in + '"', logger);
		if (s !== caseInfo.out) {
			plogger('Expected "' + caseInfo.out + '" but got: "' + s + '".  The difference details are: ' + getStringComparisonDetails(caseInfo.out, s));
		}
	});
};