module.exports = (apiKey) => {
    const opRequest = new (require('./request'))(apiKey);

    return {
        GetSales: (options = { type: 2 }) => {
            return opRequest.make('ISales/GetSales/v1', options);
        },
        GetListingLimit: () => {
            return opRequest.make('ISales/GetListingLimit/v1');
        },
        ListItems: (items) => {
            return opRequest.make('ISales/ListItems/v1', { items: items }, 'post');
        },
        EditPrice: (saleId, price) => {
            return opRequest.make('ISales/ListItems/v1', { saleid: saleId, price: price }, 'post');
        },
        EditPriceMulti: (items) => {
            let tmp = {};
            Object.keys(items).forEach(k => {
                tmp['items[' + k + ']'] = items[k];
            });
            return opRequest.make('ISales/EditPriceMulti/v1', tmp, 'post');
        },
        BumpItems: (items) => {
            return opRequest.make('ISales/BumpItems/v1', items.join(','), 'post');
        },
        ReturnItems: (items) => {
            return opRequest.make('ISales/ReturnItems/v1', items.join(','), 'post');
        },
        GetActiveTradeOffers: () => {
            return opRequest.make('ISales/GetActiveTradeOffers/v1');
        },
        Search: () => {

        },
        GetLastSales: (params = {}) => {
            return new Promise((resolve, reject) => {
                opRequest.validate(['appid', 'contextid', 'market_name'], params).then(async () => {
                    resolve(await opRequest.make('ISales/GetLastSales/v1', params));
                }).catch(param => {
                    reject({error: `GetLastSales requires the ${param} parameter. https://opskins.com/kb/api-isales#method-getlastsales-v1`});
                });
            });
        },
        GetSaleStatuses: () => {
            return opRequest.make('ISales/GetSaleStatuses/v1');
        }
    }
};