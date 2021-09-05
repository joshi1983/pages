jsgif is a submodule pointing to https://github.com/joshi1983/jsgif which was forked from https://github.com/antimatter15/jsgif

Maintaining and upgrading a fork can be challenging but some important improvements to the library were needed.
To ensure we don't lose these important changes through mistakes during upgrading,
deleting a repository, or mistakes working with the submodule, here are the critical points.
- The joshi1983 fork was created mainly to get a memory optimization added.
- https://github.com/antimatter15/jsgif/pull/33 included a nice change.
I didn't reproduce a bug stemming from the problem it fixed but a code review made it clear that the case was definitely not intended and would have the effect of always referring to an undefined variable instead of the intended one.


We want to improve performance by minifying and bundling the required jsgif libraries.


The following source scripts are needed by WebLogo:
jsgif/DynamicByteArray.js
jsgif/LZWEncoder.js
jsgif/NeuQuant.js
jsgif/GIFEncoder.js

In Windows, this will merge the files into one:
echo /* > "LICENSE.js"
type ".\jsgif\LICENSE" >> "LICENSE.js"
echo */ >> "LICENSE.js"
copy /b ".\LICENSE.js" + ".\jsgif\DynamicByteArray.js" + ".\jsgif\GIFEncoder.js" + ".\jsgif\LZWEncoder.js" + ".\jsgif\NeuQuant.js" jsgif.bundle.js

This command will minify without losing the legally required copyright-notices:
uglifyjs -c -m --comments "/(^!|@license|@preserve|@author|Copyright|copyright)/" "jsgif.bundle.js" -o "jsgif.min.js"

This will delete the temporary unminified merge file:
del jsgif.bundle.js
del LICENSE.js