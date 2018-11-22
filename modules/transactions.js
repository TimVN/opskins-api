module.exports = (apiKey) => {
    const opRequest = new (require('./request'))(apiKey);

    return {
        TransferFunds: (amount, steamID = '', uID = '') => {
            return opRequest.make('https://api.opskins.com/ITransactions/TransferFunds/v1/', {id64: steamID, uid: uID, amount: amount}, 'post');
        },
    }
};