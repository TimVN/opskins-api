module.exports = (apiKey) => {
    const opRequest = new (require('./request'))(apiKey);

    return {
        GetInventory: (page = 1, perPage = 10000) => {
            return opRequest.make('IInventory/GetInventory/v2', {page: page, per_page: perPage});
        },
        Withdraw: (items) => {
            return opRequest.make('IInventory/Withdraw/v1', { items: items.join(',') }, 'post');
        },
        Deposit: (items) => {
            return opRequest.make('IInventory/Deposit/v1', { items: JSON.stringify(items) }, 'post');
        }
    }
};