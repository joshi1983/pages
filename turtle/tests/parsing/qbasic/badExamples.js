import { specialValues } from
'../../../modules/parsing/qbasic/stringToTokenType.js';

const badExamples = specialValues.slice();
badExamples.push(
'declare declare',
'defint sub',
'defint function',
'do while',
'do until',
'do loop',
'end def',
'end function',
'end if',
'end sub',
'function defint',
'function function',
'function sub',
'gosub function',
'gosub sub',
'goto\n4',
`ifelse :y = "Y [
	goto
	1
] [
]`,
'loop while',
'loop until',
'function f',
'f)',
`select case x
case`,
`select case x
case 1
end select`,
`select case x
case 1 to
end select`,
`select case x
case 1 to print "hi"
end select`,
'sub sub',
`SUB sub()
    SELECT CASE curLevel`
);

export { badExamples };
