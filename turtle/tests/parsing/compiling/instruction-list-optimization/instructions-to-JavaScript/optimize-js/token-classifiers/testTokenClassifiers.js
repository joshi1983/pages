import { testIsContextGlobalVariableRead } from './testIsContextGlobalVariableRead.js';
import { testIsContextGlobalVariablesGetCall } from './testIsContextGlobalVariablesGetCall.js';
import { testIsContextReadVariableCall } from './testIsContextReadVariableCall.js';
import { testIsGlobalVariablesGetCall } from './testIsGlobalVariablesGetCall.js';
import { testIsGlobalVariablesSetCall } from './testIsGlobalVariablesSetCall.js';
import { testIsIdentifierReadToken } from './testIsIdentifierReadToken.js';
import { testIsJSVariableAssignment } from './testIsJSVariableAssignment.js';
import { testIsJSVariableDeclareAssignment } from './testIsJSVariableDeclareAssignment.js';
import { testIsLocalmakeAssignment } from './testIsLocalmakeAssignment.js';
import { testIsLocalVariablesDeclaration } from './testIsLocalVariablesDeclaration.js';
import { testIsLocalVariablesGetCall } from './testIsLocalVariablesGetCall.js';
import { testIsLocalVariablesSetCall } from './testIsLocalVariablesSetCall.js';
import { testIsLocalVariablesToken } from './testIsLocalVariablesToken.js';
import { testIsMakeAssignment } from './testIsMakeAssignment.js';
import { testIsNoContextGlobalVariableRead } from './testIsNoContextGlobalVariableRead.js';
import { testIsNotToken } from './testIsNotToken.js';
import { testIsScopeAgnosticVariableRead } from './testIsScopeAgnosticVariableRead.js';
import { testIsValueStackPush } from './testIsValueStackPush.js';
import { testIsVariableReadToken } from './testIsVariableReadToken.js';
import { testMayBeFinalVariableAssignment } from './testMayBeFinalVariableAssignment.js';
import { wrapAndCall } from '../../../../../../helpers/wrapAndCall.js';

export function testTokenClassifiers(logger) {
	wrapAndCall([
		testIsContextGlobalVariableRead,
		testIsContextGlobalVariablesGetCall,
		testIsContextReadVariableCall,
		testIsGlobalVariablesGetCall,
		testIsGlobalVariablesSetCall,
		testIsIdentifierReadToken,
		testIsJSVariableAssignment,
		testIsJSVariableDeclareAssignment,
		testIsLocalmakeAssignment,
		testIsLocalVariablesDeclaration,
		testIsLocalVariablesGetCall,
		testIsLocalVariablesSetCall,
		testIsLocalVariablesToken,
		testIsMakeAssignment,
		testIsNoContextGlobalVariableRead,
		testIsNotToken,
		testIsScopeAgnosticVariableRead,
		testIsValueStackPush,
		testIsVariableReadToken,
		testMayBeFinalVariableAssignment,
	], logger);
};