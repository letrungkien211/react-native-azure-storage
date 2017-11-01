const auth = require("./auth")
const axios = require("axios")

class blobService {
    constructor(storageAccountName, storageAccessKey) {
        this.storageAccountName = storageAccountName
        this.storageAccessKey = storageAccessKey
        this.baseUrl = `https://${storageAccountName}.blob.core.windows.net`
    }

    _request(path, params, method = "get") {
        const authHeader = auth.calculateAuthorizationHeader(this.storageAccountName, this.storageAccessKey,path, params)

        const config = {
            url: this.baseUrl + path,
            params: params,
            headers: authHeader,
            method: method
        }

        console.log(config)

        return axios(config)
    }

    listContainers() {
        return this._request('/', { comp: 'list' })
    }

    listBlobs(container){
        return this._request('/' + container, { comp: 'list', restype: 'container' })
    }
}

exports.createBlobService = (storageAccountName, storageAccessKey) => new blobService(storageAccountName, storageAccessKey)