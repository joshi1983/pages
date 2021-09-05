import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/fms-logo/translation-to-weblogo/translate.js';

export function testTranslate(logger) {
	const cases = [
	{'in': 'forward 100', 'out': 'forward 100'},
	{'in': 'perspective', 'out': ''},
	{'in': 'polyview', 'out': ''},
	{'in': 'SETLIGHT (LIST (RANDOM 100)/100 (RANDOM 100)/100)', 'out': ''},
	{'in': 'down 10', 'out': 'pitchDown 10'},
	{'in': 'up 10', 'out': 'pitchUp 10'},
	{'in': 'rr 10', 'out': 'rollRight 10'},
	{'in': 'lr 10', 'out': 'rollLeft 10'},
	{'in': 'clearPalette', 'out': ''},
	{'in': 'print YESNOBOX [Question] [Do you like Logo?]', 'out': 'print true'},
	{'in': 'erall', 'out': ''},
	{'in': '(erall "p)', 'out': ''},
	{'in': 'ERASE "FOO', 'out': ''},
	{'in': 'DRIBBLE "dribble.txt', 'out': ''},
	{'in': 'wait 60', 'out': ''},
	{'in': `TO ABC
  LOCAL "xyz
  MAKE "xyz 1
  PRINT :xyz
END`, 'out': `to ABC
	localmake "xyz 1
	print :xyz
end`},
	{'in': 'DEFINE "ABC [[a b] [PRINT :a]]',
	'out': `to ABC :a :b
	print :a
end`},
	{'in': 'DEFINE "ABC [[a b] [PRINT :a] [PRINT :b]]',
	'out': `to ABC :a :b
	print :a
	print :b
end`},
	{'in': `to sphere\nend`,
	'out': `to sphere2\nend`},
	{'in': 'ask 1', 'out': 'ask 1'},
	{'in': 'ask 1 2', 'out': 'ask 1 2'},
	{'in': 'ask 1 []', 'out': ''},
	{'in': 'ask 1 [print 4]', 'out': 'print 4'},
	{'in': 'CATCH "tag1 [myprogram2]', 'out': 'myprogram2'},
	{'in': 'CATCH "tag1 [print "hi]', 'out': 'print "hi'},
	{'in': 'throw "tag', 'out': ''},
	{'in': 'throw "tag print "hi', 'out': ''},
	{'in': '(throw "tag 1)', 'out': ''},
	{'in': 'to p\nask 4 [print "hi print 4]\nend',
	'out': 'to p\n\tprint "hi\n\tprint 4\nend'},
	{'in': 'name [1 2 3] "x', 'out': 'make "x [ 1 2 3 ]'},
	{'in': 'to p\nlocal "x make "x 4\nend',
	'out': 'to p\n\tlocalmake "x 4\nend'},
	{'in': 'SHOW PENCOLOR', 'out': 'print penColor'},
	{'in': `MAKE "foo "hi
SHOW THING "foo`, 'out': 'make "foo "hi\nprint :foo'},
	{'in': 'setPenSize [1 1]', 'out': 'setPenSize 1'},
	{'in': 'and "true "false', 'out': 'and true false'},
	{'in': 'FOR [I 2 7 1.5] [PRINT :I]', 'out': 'for [ "I 2 7 1.5 ] [\n\tprint :I\n]'},
	{'in': 'make "start 1\nshow (timemilli - :start) / 1000',
	'out': 'make "start 1\nprint ( ( animation.time * 1000 ) - :start ) / 1000'},
	];
	testInOutPairs(cases, translate, logger);
};