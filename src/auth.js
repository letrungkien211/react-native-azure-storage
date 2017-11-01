const CryptoJS = require("crypto-js")
import _ from 'lodash'

const toCanonicalizedParams = (params) => {
    return _.map(params, (val, key)=>{
        return {key: key, val: val}
    }).sort((a, b) => a.key.toString() > b.key.toString()).map((x)=> `${x.key}:${x.val}`).join('\n')
}

const calculateSignature = (accountName, accesskey, path, params, date = (new Date()).toUTCString(), version = '2016-05-31') => {
    const canonicalizedParams = toCanonicalizedParams(params)

    // construct input value
    var inputvalue = "GET\n" + /*VERB*/
        "\n" + /*Content-Encoding*/
        "\n" + /*Content-Language*/
        "\n" + /*Content-Length*/
        "\n" + /*Content-MD5*/
        "\n" + /*Content-Type*/
        "\n" + /*Date*/
        "\n" + /*If-Modified-Since*/
        "\n" + /*If-Match*/
        "\n" + /*If-None-Match*/
        "\n" + /*If-Unmodified-Since*/
        "\n" + /*Range*/
        `x-ms-date:${date}\n` +
        `x-ms-version:${version}\n` +
        `/${accountName}${path}\n${canonicalizedParams}`

    console.log(inputvalue)

    var secret = CryptoJS.enc.Base64.parse(accesskey)
    var hash = CryptoJS.HmacSHA256(inputvalue, secret)
    var sig = CryptoJS.enc.Base64.stringify(hash)
    
    return sig
}

exports.calculateAuthorizationHeader = (accountName, accesskey, path, params, date = (new Date()).toUTCString(), version = '2016-05-31') => {
    const sig = calculateSignature(accountName, accesskey, path, params, date, version)
    return {
        'authorization': `SharedKey ${accountName}:${sig}`,
        'x-ms-date': date,
        'x-ms-version': version
    }
}
