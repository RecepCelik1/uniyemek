const xss = require('xss');

const purifyInput = (input) => {
    return xss(input);
};

module.exports = { purifyInput };
