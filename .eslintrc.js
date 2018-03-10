module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "padded-blocks": ["error", { "blocks": "always",  "classes": "always" }],
        "max-len": ["error", 150],
        "indent": ["error", "tab", { "SwitchCase": 1 }],
        "no-underscore-dangle": "off",
        "no-tabs": "off",
        "one-var":  ["error", { "initialized": "never" }],
        "func-names": "off",
        "no-unused-expressions": "off",
        "consistent-return": "off",
	    "comma-dangle": "off"
    },
    "plugins": ["jest"],
    "env": {
        "jest/globals": true
    }
};