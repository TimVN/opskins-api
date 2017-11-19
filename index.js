const request = require('request-promise');

class OPSkins {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.User = require('./modules/user')(apiKey);
        this.Pricing = require('./modules/pricing')(apiKey);
        this.Sales = require('./modules/sales')(apiKey);
        this.Cashout = require('./modules/cashout')(apiKey);
        this.Status = require('./modules/status')(apiKey);
        this.Support = require('./modules/support')(apiKey);
        this.Inventory = require('./modules/inventory')(apiKey);
    }

    opRequest(uri) {
        return request('https://api.opskins.com/' + path + '?key=' + this.apiKey);
    }
}

module.exports = OPSkins;