import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { findToken } from '../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';
await DataTypes.asyncInit();

function testGeneralCases(logger) {
	const cases = [/*{
		'code': `to p :radius
	localmake "x pos
	localmake "size2 :radius * 0.2

	jumpTo :x
	repeat 2 [
		localmake "size2 -:size2
	]
end

p 100`, 'checks': [
{
	'token': {
		'val': 'x',
		'type': ParseTreeTokenType.VARIABLE_READ
	},
	'types': 'list<num>(minlen=3)'
},
{
	'token': {
		'val': 'radius',
		'type': ParseTreeTokenType.VARIABLE_READ,
		'hasParentVal': '*'
	},
	'types': 'int'
}
]},{
		'code': `make "x pos\nqueue "x "hi\nprint :x`, 'checks': [
{
	'token': {
		'val': 'x',
		'type': ParseTreeTokenType.VARIABLE_READ
	},
	'types': 'list<num|string>(minlen=3)' // minlen=4 would be ok too.
},
{
	'token': {
		'val': 'pos',
		'type': ParseTreeTokenType.PARAMETERIZED_GROUP,
	},
	'types': 'list<num>(minlen=3)'
}
]}, {
	'code': `make "points []
repeat 100 [
	queue2 "points pos
]
print item 1 :points`, 'checks': [{
	'token': {
		'val': 'item',
		'type': ParseTreeTokenType.PARAMETERIZED_GROUP,
	},
	'types': 'list<num>(minlen=3)'
},{
	'token': {
		'val': 'pos'
	},
	'types': 'list<num>(minlen=3)'
}
]
}, {
	'code': `make "points []
repeat 100 [
	queue2 "points pos
]
repeat 100 [
	make "fromPoint item repcount :points
	print round :fromPoint / 5
]`, 'checks': [{
	'token': {
		'val': 'item',
		'type': ParseTreeTokenType.PARAMETERIZED_GROUP,
	},
	'types': 'list<num>(minlen=3)'
},{
	'token': {
		'val': 'pos'
	},
	'types': 'list<num>(minlen=3)'
},{
	'token': {
		'val': 'fromPoint',
		'type': ParseTreeTokenType.VARIABLE_READ
	},
	'types': 'list<num>(minlen=3)'
}
]
}, {
		'code': `make "offsets [60 90 120]
make "points []
queue2 "points pos
repeat 2 [
	print 3 + (item repcount :offsets)
]`, 'checks': [
			{
				'token': {
					'val': 'pos'
				},
				'types': 'list<num>(minlen=3)'
			},
			{
				'token': {
					'val': 'offsets',
					'type': ParseTreeTokenType.VARIABLE_READ
				},
				'types': 'colorlist'
			},
			{
				'token': {
					'val': 'item'
				},
				'types': 'num'
			}
]
	}, {
		'code': `make "x 0
make "y "hello
swap "x "y
print :X
	print :Y`,  'checks': [
	{
		'token': {
			'val': 'X'
		},
		'types': 'string'
	},{
		'token': {
			'val': 'Y'
		},
		'types': 'int'
	}]
	},{'code': 'print ifelse 1 < 2 ["red] ["blue]',
		'checks': [
		{
			'token': {
				'val': null,
				'hasChildVal': 'red',
				'type': ParseTreeTokenType.LIST,
			},
			'types': 'list<colorstring>(minlen=1)'
		},{
			'token': {
				'val': null,
				'hasChildVal': 'blue',
				'type': ParseTreeTokenType.LIST,
			},
			'types': 'list<colorstring>(minlen=1)'
		},{
			'token': {
				'val': 'ifelse'
			},
			'types': 'list<colorstring>(minlen=1)'
		}]
	}, {
		'code': `to p
	make "x 4
	print :x
end

make "x "Hi
prinT "x`, 'checks': [{
	'token': {
		'val': 'x',
		'hasParentVal': 'prinT'
	},
	'types': 'string'
}, {
	'token': {
		'val': 'x',
		'hasParentVal': 'print'
	},
	'types': 'int|string' // Idealy, this would be 'string' but we're not quite there yet.
}
	]
	}, {
		'code': `	make "x []
priNt :X

to p
	make "x 4
	print :x
end

make "x "Hi
prinT "x`, 'checks': [{
	'token': {
		'val': 'X',
		'hasParentVal': 'priNt'
	},
	'types': 'list'
}, {
	'token': {
		'val': 'x',
		'hasParentVal': 'prinT'
	},
	'types': 'string'
}, {
	'token': {
		'val': 'x',
		'hasParentVal': 'print'
	},
	'types': 'int|string' // Idealy, this would be 'string' but we're not quite there yet.
}
	]
	}, {
		'code': 'print arcSin 1.3',
		'checks': [
			{'token': {'val': 'arcSin'},
			'types': 'num(finite)'
			}
		]
	},
	{'code': `to p :val
	ifElse number? :val [
		ifElse :val < 0 [
			print int :Val
		] [
			localmake "val min 10 :val
			setPenColor item :val + 1 :colorPalette
		]
	] [
	]
end

p "hello`,
		'checks': [
			{'token': {'val': 'Val', 'hasParentVal': 'int'},
			'types': 'num' // because of the ifElse number? :val
			}
	]
	},{
		'code': `to p
		output 3
end

print (invoke "p)`,
	'checks': [
			{'token': {'val': 'p', 'type': ParseTreeTokenType.STRING_LITERAL},
			'types': 'cproc:0(returntypes=int)'
			}
	]
	},{
		'code': `print 1/0`,
	'checks': [
			{'token': {'val': '/'},
			'types': 'num(unfinite)'
			}
	]
	},*/{
		'code': `print :x/0`,
	'checks': [
			{'token': {'val': '/'},
			'types': 'num(unfinite)'
			}
	]
	},{
		'code': `make "y 0\nprint :x/:y`,
	'checks': [
			{'token': {'val': '/'},
			'types': 'num(unfinite)'
			}
	]
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const tokens = tree.getAllTokens();
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const cLogger = prefixWrapper(`Check ${checkIndex}`, plogger);
			const token = findToken(checkInfo.token, tokens, cLogger);
			if (token !== undefined) {
				const tokenTypes = tree.getPossibleTypesFromToken(token);
				if (tokenTypes === undefined)
					cLogger(escapeHTML(`Expected to find types ${checkInfo.types} but got undefined`));
				else if (DataTypes.stringify(tokenTypes) !== checkInfo.types)
					cLogger(escapeHTML(`Expected to find types ${checkInfo.types} but got ${DataTypes.stringify(tokenTypes)}`));
			}
		});
	});
}

export function testCachedParseTreeGetPossibleTypesFromToken(logger) {
	wrapAndCall([
		testGeneralCases
	], logger);
};