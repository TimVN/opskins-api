module.exports = (apiKey) => {
    const opRequest = new (require('./request'))(apiKey);

    return {
        RepairItem: (saleId) => {
            return opRequest.make('ISupport/RepairItem/v1', { saleid: saleId });
        }
    }
};