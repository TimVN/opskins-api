module.exports = (apiKey) => {
    const opRequest = new (require('./request'))(apiKey);

    return {
        GetPriceList: (appId) => {
            return opRequest.make('IPricing/GetPriceList/v2', { appid: appId }, null, true);
        },
        GetAllLowestListPrices: (appId) => {
            return opRequest.make('IPricing/GetAllLowestListPrices/v1', { appid: appId }, null, true);
        }
    }
};