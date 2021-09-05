import { animationSetupFixer } from './animationSetupFixer.js';
import { animationSnapshotStyleFixer } from './animationSnapshotStyleFixer.js';
import { autoRemoveFixer } from './autoRemoveFixer.js';
import { booleanExpressionAsListFixer } from './booleanExpressionAsListFixer.js';
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
import { ifElseFixer } from './ifElseFixer.js';
import { leafsInDataListsToStringLiteralsFixer } from './leafsInDataListsToStringLiteralsFixer.js';
import { localFixer } from './localFixer.js';
import { missingSpacesFixer } from './missingSpacesFixer.js';
import { nameCallFixer } from './nameCallFixer.js';
import { pcFixer } from './pcFixer.js';
import { penUpPenDownRemoveFixer } from './penUpPenDownRemoveFixer.js';
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
import { setPenSizeFixer } from './setPenSizeFixer.js';
import { simplifySetHeadingFixer } from './simplifySetHeadingFixer.js';
import { thingCallFixer } from './thingCallFixer.js';
import { transparentCommandFixer } from './transparentCommandFixer.js';
import { unrecognizedParameterizedGroupNameFixer } from './unrecognizedParameterizedGroupNameFixer.js';
import { useStrFixer } from './useStrFixer.js';
import { webTurtleCommandFixer } from './webTurtleCommandFixer.js';
import { webTurtleProcedureFixer } from './webTurtleProcedureFixer.js';
import { webTurtleRepeatFixer } from './webTurtleRepeatFixer.js';
import { variableNameReferenceFixer } from './variableNameReferenceFixer.js';

const allFixers = [
animationSetupFixer,
animationSnapshotStyleFixer,
autoRemoveFixer,
booleanExpressionAsListFixer,
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
ifElseFixer,
leafsInDataListsToStringLiteralsFixer,
localFixer,
missingSpacesFixer,
nameCallFixer,
pcFixer,
penUpPenDownRemoveFixer,
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
setPenSizeFixer,
simplifySetHeadingFixer,
thingCallFixer,
transparentCommandFixer,
unrecognizedParameterizedGroupNameFixer,
useStrFixer,
webTurtleCommandFixer,
webTurtleProcedureFixer,
webTurtleRepeatFixer,
variableNameReferenceFixer,
];
export { allFixers };