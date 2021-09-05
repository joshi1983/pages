/*
These tests should not overlap coverage from testCommands.js 
which runs all automated test cases from json/commands.json.

These tests are covering cases that can't be expressed in JSON.
The cases may verify side-effects or other requirements instead of the output values.
*/
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { testArrayCommands } from './testArrayCommands.js';
import { testEasingCommands } from './testEasingCommands.js';
import { testHelpers } from './helpers/testHelpers.js';
import { testListCommands } from './testListCommands.js';
import { testMath } from './testMath.js';
import { testPropertyListCommands } from './testPropertyListCommands.js';
import { testTurtle } from './testTurtle.js';
import { testTurtleLineCommands } from './testTurtleLineCommands.js';
import { testTurtlePenCommands } from './testTurtlePenCommands.js';
import { testTurtlePosCommands } from './testTurtlePosCommands.js';

export function testCommandGroups(logger) {
	testArrayCommands(prefixWrapper('testArrayCommands', logger));
	testEasingCommands(prefixWrapper('testEasingCommands', logger));
	testHelpers(prefixWrapper('testHelpers', logger));
	testListCommands(prefixWrapper('testListCommands', logger));
	testMath(prefixWrapper('testMath', logger));
	testPropertyListCommands(prefixWrapper('testPropertyListCommands', logger));
	testTurtle(prefixWrapper('testTurtle', logger));
	testTurtleLineCommands(prefixWrapper('testTurtleLineCommands', logger));
	testTurtlePenCommands(prefixWrapper('testTurtlePenCommands', logger));
	testTurtlePosCommands(prefixWrapper('testTurtlePosCommands', logger));
};