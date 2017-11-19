module.exports = (apiKey) => {
    const opRequest = new (require('./request'))(apiKey);
    const processors = {
        paypal: 1,
        bitcoin: 3,
        skrill: 5
    };

    return {
        GetAddress: (processor) => {
            return new Promise((resolve, reject) => {
                if (!processors[processor]) {
                    return reject({error: `GetAddress accepts 'paypal', 'bitcoin' or 'skrill' as argument 0`});
                }
                resolve(opRequest.make('ICashout/GetAddress/v1', { processor: processors[processor] }));
            });
        },
        GetPendingCashouts: () => {
            return opRequest.make('ICashout/GetPendingCashouts/v1');
        },
        CancelPendingCashout: (cashoutId) => {
            return opRequest.make('ICashout/CancelPendingCashout/v1', { cashoutid: cashoutId }, 'post');
        },
        GetBitcoinInstantCashoutRate: () => {
            return opRequest.make('ICashout/GetBitcoinInstantCashoutRate/v1');
        },
        RequestPayPal: (amount, priority = 0) => {
            return opRequest.make('ICashout/RequestPayPal/v1', { amount: amount, priority: priority }, 'post');
        },
        RequestBitcoin: (amount, priority = 0) => {
            return opRequest.make('ICashout/RequestBitcoin/v1', { amount: amount, priority: priority }, 'post');
        },
        RequestSkrill: (amount) => {
            return opRequest.make('ICashout/RequestSkrill/v1', {amount: amount, priority: priority}, 'post');
        },
        GetCashoutableBalance: () => {
            return opRequest.make('ICashout/GetCashoutableBalance/v1');
        }
    }
};