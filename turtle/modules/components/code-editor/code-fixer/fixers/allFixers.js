import { animationSetupFixer } from './animationSetupFixer.js';
import { animationSnapshotStyleFixer } from './animationSnapshotStyleFixer.js';
import { arrayLiteralFixer } from './arrayLiteralFixer.js';
import { autoRemoveFixer } from './autoRemoveFixer.js';
import { booleanExpressionAsListFixer } from './booleanExpressionAsListFixer.js';
import { colorCallWithDataListFixer } from './colorCallWithDataListFixer.js';
import { colourStringLiteralFixer } from './colourStringLiteralFixer.js';
import { commaFixer } from './commaFixer.js';
import { commandTranslationFixer } from './commandTranslationFixer.js';
import { convertToJumpCommandFixer } from './convertToJumpCommandFixer.js';
import { curvedBracketFixer } from './curvedBracketFixer.js';
import { defineFixer } from './defineFixer.js';
import { doTimesFixer } from './doTimesFixer.js';
import { endifFixer } from './endifFixer.js';
import { erroneousSpacesFixer } from './erroneousSpacesFixer.js';
import { filledFixer } from './filledFixer.js';
import { forLoopSettingsContainedListFixer } from './forLoopSettingsContainedListFixer.js';
import { forLoopVariableFixer } from './forLoopVariableFixer.js';
import { globalLocalmakeFixer } from './globalLocalmakeFixer.js';
import { hatSymbolPowerFixer } from './hatSymbolPowerFixer.js';
import { ifElseFixer } from './ifElseFixer.js';
import { jumpFixer } from './jumpFixer.js';
import { leafsInDataListsToStringLiteralsFixer } from './leafsInDataListsToStringLiteralsFixer.js';
import { localFixer } from './localFixer.js';
import { makeAssignFixer } from './makeAssignFixer.js';
import { minusSignSpaceInsertFixer } from './minusSignSpaceInsertFixer.js';
import { missingSpacesFixer } from './missingSpacesFixer.js';
import { nameCallFixer } from './nameCallFixer.js';
import { pcFixer } from './pcFixer.js';
import { penUpPenDownRemoveFixer } from './penUpPenDownRemoveFixer.js';
import { penWidthCallWithValueFixer } from './penWidthCallWithValueFixer.js';
import { polishNotationFixer } from './polishNotationFixer.js';
import { polyEndAfterProcedureFixer } from './polyEndAfterProcedureFixer.js';
import { polyFixer } from './polyFixer.js';
import { procedureInProcedureFixer } from './procedureInProcedureFixer.js';
import { quoteBooleanFixer } from './quoteBooleanFixer.js';
import { quotedParameterFixer } from './quotedParameterFixer.js';
import { quoteIntegerFixer } from './quoteIntegerFixer.js';
import { quoteNumberFixer } from './quoteNumberFixer.js';
import { readCommandFixer } from './readCommandFixer.js';
import { replaceSpecialQuoteCharactersWithNormalQuotes } from './replaceSpecialQuoteCharactersWithNormalQuotes.js';
import { requiredColourNameLongStringFixer } from './requiredColourNameLongStringFixer.js';
import { runFixer } from './runFixer.js';
import { setPenSizeFixer } from './setPenSizeFixer.js';
import { simplifySetHeadingFixer } from './simplifySetHeadingFixer.js';
import { thingCallFixer } from './thingCallFixer.js';
import { tildeFixer } from './tildeFixer.js';
import { transparentCommandFixer } from './transparentCommandFixer.js';
import { unrecognizedParameterizedGroupNameFixer } from './unrecognizedParameterizedGroupNameFixer.js';
import { useStrFixer } from './useStrFixer.js';
import { webTurtleCommandFixer } from './webTurtleCommandFixer.js';
import { webTurtleProcedureFixer } from './webTurtleProcedureFixer.js';
import { webTurtleRepeatFixer } from './webTurtleRepeatFixer.js';
import { variableNameReferenceFixer } from './variableNameReferenceFixer.js';
import { variableReadSpaceInsertFixer } from './variableReadSpaceInsertFixer.js';

const allFixers = [
animationSetupFixer,
animationSnapshotStyleFixer,
arrayLiteralFixer,
autoRemoveFixer,
booleanExpressionAsListFixer,
colorCallWithDataListFixer,
colourStringLiteralFixer,
commaFixer,
commandTranslationFixer,
convertToJumpCommandFixer,
curvedBracketFixer,
defineFixer,
doTimesFixer,
endifFixer,
erroneousSpacesFixer,
filledFixer,
forLoopSettingsContainedListFixer,
forLoopVariableFixer,
globalLocalmakeFixer,
hatSymbolPowerFixer,
ifElseFixer,
jumpFixer,
leafsInDataListsToStringLiteralsFixer,
localFixer,
makeAssignFixer,
minusSignSpaceInsertFixer,
missingSpacesFixer,
nameCallFixer,
pcFixer,
penUpPenDownRemoveFixer,
penWidthCallWithValueFixer,
polishNotationFixer,
polyEndAfterProcedureFixer,
polyFixer,
procedureInProcedureFixer,
quoteBooleanFixer,
quotedParameterFixer,
quoteIntegerFixer,
quoteNumberFixer,
readCommandFixer,
replaceSpecialQuoteCharactersWithNormalQuotes,
requiredColourNameLongStringFixer,
runFixer,
setPenSizeFixer,
simplifySetHeadingFixer,
thingCallFixer,
tildeFixer,
transparentCommandFixer,
unrecognizedParameterizedGroupNameFixer,
useStrFixer,
webTurtleCommandFixer,
webTurtleProcedureFixer,
webTurtleRepeatFixer,
variableNameReferenceFixer,
variableReadSpaceInsertFixer
];
export { allFixers };