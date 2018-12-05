module.exports = (apiKey) => {
    const opRequest = new (require('./request'))(apiKey);

    return {
        CreateClient: (name, redirect_uri, can_keep_secret = 1) => {
            return opRequest.make('IOAuth/CreateClient/v1', {
                name: name,
                redirect_uri: redirect_uri,
                can_keep_secret: can_keep_secret
            }, 'post');
        },
        DeleteClient: (client_id) => {
            return opRequest.make('IOAuth/DeleteClient/v1', {
                client_id: client_id
            }, 'post');
        },
        GetOwnedClientList: (client_id) => {
            return opRequest.make('IOAuth/GetOwnedClientList/v1');
        },
        ResetClientSecret: (client_id) => {
            return opRequest.make('IOAuth/ResetClientSecret/v1', {
                client_id: client_id
            }, 'post');
        },
        UpdateClient: (client_id, name, redirect_uri) => {
            return opRequest.make('IOAuth/UpdateClient/v1', {
                client_id: client_id,
                name: name,
                redirect_uri: redirect_uri,
            }, 'post');
        },
    }
};