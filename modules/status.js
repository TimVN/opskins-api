module.exports = (apiKey) => {
    const opRequest = new (require('./request'))(apiKey);

    return {
        GetBotList: () => {
            return opRequest.make('IStatus/GetBotList/v1');
        }
    }
};