import { testIsCommandCall } from './testIsCommandCall.js';
import { testIsContextGlobalVariableRead } from './testIsContextGlobalVariableRead.js';
import { testIsContextGlobalVariablesGetCall } from './testIsContextGlobalVariablesGetCall.js';
import { testIsContextGlobalVariablesSetCall } from './testIsContextGlobalVariablesSetCall.js';
import { testIsContextLocalVariablesGet } from './testIsContextLocalVariablesGet.js';
import { testIsContextLocalVariablesSet } from './testIsContextLocalVariablesSet.js';
import { testIsContextMakeCall } from './testIsContextMakeCall.js';
import { testIsContextReadVariableCall } from './testIsContextReadVariableCall.js';
import { testIsContextValueStackLength } from './testIsContextValueStackLength.js';
import { testIsContextValueStackPop } from './testIsContextValueStackPop.js';
import { testIsContextValueStackPush } from './testIsContextValueStackPush.js';
import { testIsContextValueStackPushThroughAssignment } from './testIsContextValueStackPushThroughAssignment.js';
import { testIsContextValueStackReference } from './testIsContextValueStackReference.js';
import { testIsDynamicVariableNameMakeAssignment } from './testIsDynamicVariableNameMakeAssignment.js';
import { testIsGlobalVariablesGetCall } from './testIsGlobalVariablesGetCall.js';
import { testIsGlobalVariablesSetCall } from './testIsGlobalVariablesSetCall.js';
import { testIsIdentifierReadToken } from './testIsIdentifierReadToken.js';
import { testIsJSVariableAssignment } from './testIsJSVariableAssignment.js';
import { testIsJSVariableDeclareAssignment } from './testIsJSVariableDeclareAssignment.js';
import { testIsLastContextValueStackElementExpression } from './testIsLastContextValueStackElementExpression.js';
import { testIsLastNoContextValueStackElementExpression } from './testIsLastNoContextValueStackElementExpression.js';
import { testIsLastValueStackElementAssignment } from './testIsLastValueStackElementAssignment.js';
import { testIsLastValueStackElementExpression } from './testIsLastValueStackElementExpression.js';
import { testIsLocalmakeAssignment } from './testIsLocalmakeAssignment.js';
import { testIsLocalVariableRead } from './testIsLocalVariableRead.js';
import { testIsLocalVariablesDeclaration } from './testIsLocalVariablesDeclaration.js';
import { testIsLocalVariablesGetCall } from './testIsLocalVariablesGetCall.js';
import { testIsLocalVariablesSetCall } from './testIsLocalVariablesSetCall.js';
import { testIsLocalVariablesToken } from './testIsLocalVariablesToken.js';
import { testIsMakeAssignment } from './testIsMakeAssignment.js';
import { testIsNoContextGlobalVariableRead } from './testIsNoContextGlobalVariableRead.js';
import { testIsNoContextGlobalVariablesSetCall } from './testIsNoContextGlobalVariablesSetCall.js';
import { testIsNoContextValueStackPop } from './testIsNoContextValueStackPop.js';
import { testIsNoContextValueStackPush } from './testIsNoContextValueStackPush.js';
import { testIsNoContextValueStackReference } from './testIsNoContextValueStackReference.js';
import { testIsNotToken } from './testIsNotToken.js';
import { testIsReadWriteReference } from './testIsReadWriteReference.js';
import { testIsScopeAgnosticVariableRead } from './testIsScopeAgnosticVariableRead.js';
import { testIsThisMethodCall } from './testIsThisMethodCall.js';
import { testIsUselessVariableDeclaration } from './testIsUselessVariableDeclaration.js';
import { testIsValueStackLength } from './testIsValueStackLength.js';
import { testIsValueStackLengthUpdate } from './testIsValueStackLengthUpdate.js';
import { testIsValueStackLengthUnaryUpdate } from './testIsValueStackLengthUnaryUpdate.js';
import { testIsValueStackPush } from './testIsValueStackPush.js';
import { testIsVariableAssignment } from './testIsVariableAssignment.js';
import { testIsVariableAssignmentRightSideToken } from './testIsVariableAssignmentRightSideToken.js';
import { testIsVariableReadToken } from './testIsVariableReadToken.js';
import { testMayBeFinalVariableAssignment } from './testMayBeFinalVariableAssignment.js';
import { testMightCauseSideEffects } from './testMightCauseSideEffects.js';
import { wrapAndCall } from '../../../../../../helpers/wrapAndCall.js';

export function testTokenClassifiers(logger) {
	wrapAndCall([
		testIsCommandCall,
		testIsContextGlobalVariableRead,
		testIsContextGlobalVariablesGetCall,
		testIsContextGlobalVariablesSetCall,
		testIsContextLocalVariablesGet,
		testIsContextLocalVariablesSet,
		testIsContextMakeCall,
		testIsContextReadVariableCall,
		testIsContextValueStackLength,
		testIsContextValueStackPop,
		testIsContextValueStackPush,
		testIsContextValueStackPushThroughAssignment,
		testIsContextValueStackReference,
		testIsDynamicVariableNameMakeAssignment,
		testIsGlobalVariablesGetCall,
		testIsGlobalVariablesSetCall,
		testIsIdentifierReadToken,
		testIsJSVariableAssignment,
		testIsJSVariableDeclareAssignment,
		testIsLastContextValueStackElementExpression,
		testIsLastNoContextValueStackElementExpression,
		testIsLastValueStackElementAssignment,
		testIsLastValueStackElementExpression,
		testIsLocalmakeAssignment,
		testIsLocalVariableRead,
		testIsLocalVariablesDeclaration,
		testIsLocalVariablesGetCall,
		testIsLocalVariablesSetCall,
		testIsLocalVariablesToken,
		testIsMakeAssignment,
		testIsNoContextGlobalVariableRead,
		testIsNoContextGlobalVariablesSetCall,
		testIsNoContextValueStackPop,
		testIsNoContextValueStackPush,
		testIsNoContextValueStackReference,
		testIsNotToken,
		testIsReadWriteReference,
		testIsScopeAgnosticVariableRead,
		testIsThisMethodCall,
		testIsUselessVariableDeclaration,
		testIsValueStackLength,
		testIsValueStackLengthUpdate,
		testIsValueStackLengthUnaryUpdate,
		testIsValueStackPush,
		testIsVariableAssignment,
		testIsVariableAssignmentRightSideToken,
		testIsVariableReadToken,
		testMayBeFinalVariableAssignment,
		testMightCauseSideEffects,
	], logger);
};