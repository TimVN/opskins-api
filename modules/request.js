const request = require('request-promise');

class OPRequest {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    make(uri, form = {}, method = 'get', excludeApiKey = false) {
        if (!excludeApiKey) {
            form.key = this.apiKey;
        }

        switch(method) {
            case 'post':
                return request.post('https://api.opskins.com/' + uri, { form: form, json: true});
                break;

            default:
                return request('https://api.opskins.com/' + uri + '/' + this.serialize(form), {json: true});
        }
    }

    full(uri, form = {}, method = 'get', excludeApiKey = false) {
        if (!excludeApiKey) {
            form.key = this.apiKey;
        }

        return new Promise((resolve, reject) => {
            request({
                uri: 'https://api.opskins.com/' + uri + '/' + this.serialize(form),
                resolveWithFullResponse: true
            }).then(result => {
                resolve(result);
            });
        });
    }

    validate(req, params) {
        return new Promise((resolve, reject) => {
            req.forEach(k => {
                if (!params.hasOwnProperty(k)) {
                    return reject(k);
                }
            });

            resolve();
        });
    }

    serialize(form) {
        let str = '?';
        let c = 0;
        Object.keys(form).forEach(k => {
            str += k + '=' + form[k];
            if (c<Object.keys(form).length-1) {
                str += '&';
            }
            c++;
        });

        return str;
    }
}

module.exports = OPRequest;