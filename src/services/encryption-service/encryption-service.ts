const CryptoJS = require('crypto-js')
const key = 'v6z7qozzod796frig88xregeuecfsaar'
const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex)
export class encryptionService {
  encrypt(plainText: any) {
    const b64 = CryptoJS.AES.encrypt(plainText, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString()
    const e64 = CryptoJS.enc.Base64.parse(b64)
    const eHex = e64.toString(CryptoJS.enc.Hex)
    return { iv: iv, en: eHex }
  }

  decrypt(cipherText: any) {
    const reb64 = CryptoJS.enc.Hex.parse(cipherText)
    const bytes = reb64.toString(CryptoJS.enc.Base64)
    const decrypt = CryptoJS.AES.decrypt(bytes, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    const plain = decrypt.toString(CryptoJS.enc.Utf8)
    return plain
  }
}
