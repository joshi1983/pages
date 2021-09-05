import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteSwitch(logger) {
	const cases = [
		{'code': `switch`, 'messages': []},
		{'code': `int num = 1;

switch(num) {
}`, 'messages': []},
		{'code': `int num = 1;

switch(num) {
  default: 
    println("One");  // Prints "One"
    break;
}`, 'messages': ['One']},
		{'code': `int num = 1;

switch(num) {
  case 1: 
    println("One");  // Prints "One"
    break;
}`, 'messages': ['One']},
		{'code': `int num = 1;

switch(num) {
	case 0:
  case 1: 
    println("One");  // Prints "One"
    break;
}`, 'messages': ['One']},
		{'code': `int num = 1;

switch(num) {
  case 0: 
    println("Zero");  // Does not execute
    break;
  case 1: 
    println("One");  // Prints "One"
    break;
}`, 'messages': ['One']},
		{'code': `int num = 1;

switch(num) {
  case 0: 
    println("Zero");  // Does not execute
  case 1: 
    println("One");  // Prints "One"
    break;
}`, 'messages': ['One']},
		{'code': `int num = 0;

switch(num) {
  case 0: 
    println("Zero");
  case 1: 
    println("One");
    break;
}`, 'messages': ['Zero', 'One']},
		{'code': `int num = 0;

switch(num) {
  case 0: 
    println("Zero");
  case 1: 
    println("One");
}`, 'messages': ['Zero', 'One']},
		{'code': `int num = 0;

switch(num) {
  case 0: 
    println("Zero");
  case 1: 
    println("One");
  case 2: 
    println("Two");
 default:
	println("default");
}`, 'messages': ['Zero', 'One', "Two", "default"]},
		{'code': `int num = 0;

switch(num) {
  case 0: 
    println("Zero");
  case 1: 
    println("One");
  case 2: 
    println("Two");
	break; // should cause the default case to get skipped.
 default:
	println("default");
}`, 'messages': ['Zero', 'One', "Two"]},
		{'code': `int num = 2;

switch(num) {
  case 0: 
    println("Zero");
  case 1: 
    println("One");
  case 2: 
    println("Two");
 default:
	println("default");
}`, 'messages': ["Two", "default"]},
	];
	processTranslateExecuteCases(cases, logger);
};