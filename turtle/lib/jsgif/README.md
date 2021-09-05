jsgif is a submodule pointing to https://github.com/antimatter15/jsgif

We want to improve performance by minifying and bundling the required jsgif libraries.


The following source scripts are needed by WebLogo:
jsgif/LZWEncoder.js
jsgif/NeuQuant.js
jsgif/GIFEncoder.js

In Windows, this will merge the files into one:
echo /* > "LICENSE.js"
type ".\jsgif\LICENSE" >> "LICENSE.js"
echo */ >> "LICENSE.js"
copy /b ".\LICENSE.js" + ".\jsgif\GIFEncoder.js" + ".\jsgif\LZWEncoder.js" + ".\jsgif\NeuQuant.js" jsgif.bundle.js

This command will minify without losing the legally required copyright-notices:
uglifyjs -c -m --comments "/(^!|@license|@preserve|@author|Copyright|copyright)/" "jsgif.bundle.js" -o "jsgif.min.js"

This will delete the temporary unminified merge file:
del jsgif.bundle.js
del LICENSE.js