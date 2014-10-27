"use strict";

require.define({
    "jquery": function (require, exports, module) {
        return module.exports = $;
    },

    "underscore": function (require, exports, module) {
        return module.exports = _;
    },

    "flux": function (require, exports, module) {
        return module.exports = Flux;
    }
});