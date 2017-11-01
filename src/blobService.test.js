const { storageAccessKey, storageAccountName } = require("./config")
const { createBlobService } = require("./blobService")
const axios = require('axios')
const { parseString } = require('xml2js')

it('Test list containers Success', () => {
    const blobService = createBlobService(storageAccountName, storageAccessKey)
    blobService.listContainers()
        .then((res) => {
            // console.log(res.data)            
            expect(res.status).toBe(200)
        })
        .catch(error => {
            expect(error).toBeNull()
        })
})

it('Test list blobs', () => {
    const blobService = createBlobService(storageAccountName, storageAccessKey)
    blobService.listBlobs('test')
        .then((res) => {
            console.log(res.data)
            expect(res.status).toBe(200)
        })
        .catch(error => {
            console.error(error)
            expect(error).toBe(null)
        })
})

it('Test list containers invalid key', () => {
    const blobService = createBlobService(storageAccountName, 'aaaaaafdfdfdfd')
    blobService.listContainers().then((res) => {
        expect(res).toBeNull()
    }).catch(error => {
        expect(error.response.status).toBe(403)
    })
})

it('Test list containers invalid storage', () => {
    const blobService = createBlobService('fdfdfdfdfa', 'aaaaaafdfdfdfd')
    blobService.listContainers().then((res) => {
        expect(res).toBeNull()
    }).catch(error => {
        expect(error.code).toBe('ENOTFOUND')
    })
})