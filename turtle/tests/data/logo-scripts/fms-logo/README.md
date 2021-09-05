This is intended for code that runs properly in FMSLogo.
FMSLogo is basically a newer version of MSWLogo so a lot of 
MSWLogo examples would be good here too.

The WebLogo version of the Logo programming language is very similar to FMSLogo's.
The languages are ideally the same except for a few differences that are
well justified.  Some differences are explained at:
content/help/differences-from-fms-logo.html

Many differences can be managed by the code editor's Autofix feature.
Some specialized translation is also applied when isLikelyFMSLogo returns true.
For example, "rr" in FMSLogo should become rollRight in WebLogo.
A commands.json hintNames on rollRight would indicate that broadly but what if someone
copied code from another version of Logo that uses "rr" for something else?
"rr" is so extremely short that it is a little too ambiguous to broadly translate to rollRight.
Instead, we'll do this translation only if isLikelyFMSLogo returns true.