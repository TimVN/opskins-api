const request = require('request-promise');

class OPSkins {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.opRequest = new (require('./modules/request'))(apiKey);
        this.User = require('./modules/user')(apiKey);
        this.Pricing = require('./modules/pricing')(apiKey);
        this.Sales = require('./modules/sales')(apiKey);
        this.Cashout = require('./modules/cashout')(apiKey);
        this.Status = require('./modules/status')(apiKey);
        this.Support = require('./modules/support')(apiKey);
        this.Inventory = require('./modules/inventory')(apiKey);
        this.Transactions = require('./modules/transactions')(apiKey);
        this.Auth = require('./modules/oauth')(apiKey);
        this.Test = () => {
            return this.opRequest.make('ITest/TestAuthed/v1');
        };
        this.CallsLeft = () => {
            return new Promise(async (resolve, reject) => {
                let call = await this.opRequest.full('ITest/TestAuthed/v1');
                resolve(call.headers['x-queries-remaining'] ? call.headers['x-queries-remaining'] : 0);
            });
        };
    }
}

module.exports = OPSkins;