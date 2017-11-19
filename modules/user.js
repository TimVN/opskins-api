module.exports = (apiKey) => {
    const opRequest = new (require('./request'))(apiKey);

    return {
        GetBalance: () => {
            return opRequest.make('IUser/GetBalance/v1');
        },
        SaveTradeURL: (tradeUrl) => {
            return opRequest.make('IUser/SaveTradeURL/v1', {
                trade_url: tradeUrl
            }, 'post');
        }
    }
};