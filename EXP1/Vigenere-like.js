const cipher = Buffer.from("F96DE8C227A259C87EE1DA2AED57C93FE5DA36ED4EC87EF2C63AAE5B9A7EFFD673BE4ACF7BE8923CAB1ECE7AF2DA3DA44FCF7AE29235A24C963FF0DF3CA3599A70E5DA36BF1ECE77F8DC34BE129A6CF4D126BF5B9A7CFEDF3EB850D37CF0C63AA2509A76FF9227A55B9A6FE3D720A850D97AB1DD35ED5FCE6BF0D138A84CC931B1F121B44ECE70F6C032BD56C33FF9D320ED5CDF7AFF9226BE5BDE3FF7DD21ED56CF71F5C036A94D963FF8D473A351CE3FE5DA3CB84DDB71F5C17FED51DC3FE8D732BF4D963FF3C727ED4AC87EF5DB27A451D47EFD9230BF47CA6BFEC12ABE4ADF72E29224A84CDF3FF5D720A459D47AF59232A35A9A7AE7D33FB85FCE7AF5923AA31EDB3FF7D33ABF52C33FF0D673A551D93FFCD33DA35BC831B1F43CBF1EDF67F0DF23A15B963FE5DA36ED68D378F4DC36BF5B9A7AFFD121B44ECE76FEDC73BE5DD27AFCD773BA5FC93FE5DA3CB859D26BB1C63CED5CDF3FE2D730B84CDF3FF7DD21ED5ADF7CF0D636BE1EDB79E5D721ED57CE3FE6D320ED57D469F4DC27A85A963FF3C727ED49DF3FFFDD24ED55D470E69E73AC50DE3FE5DA3ABE1EDF67F4C030A44DDF3FF5D73EA250C96BE3D327A84D963FE5DA32B91ED36BB1D132A31ED87AB1D021A255DF71B1C436BF479A7AF0C13AA14794", "hex")
const MAX_KEY_LENGTH = 13
const decrypt = (cipher, key) => {
    const plain = Buffer.alloc(cipher.length)
    for (let i = 0; i < cipher.length; i++) {
        plain[i] = cipher[i] ^ key[i % key.length]
    }
    return plain
}
const acceptPlainText = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,. "

let keyLength = 0
// 找key长度
let possibleKeyLengths = []
for (let keylen = 1; keylen < MAX_KEY_LENGTH; keylen++) {
    let trys = []
    for (let j = 0; j < cipher.length; j += keylen) {
        trys.push(cipher[j])
    }
    //console.log(trys)
    for (let k = 0; k <= 0xFF; k++) {
        let flag = true
        for (let i in trys) {
            const a = trys[i] ^ k
            if (!acceptPlainText.includes(String.fromCharCode(a))) {
                flag = false
                break
            }
        }
        if (flag) {
            console.log("might key: " + k)
            if (!possibleKeyLengths.includes(keylen)) possibleKeyLengths.push(keylen)
        }
    }
}
console.log("key length:", possibleKeyLengths)
// 此时只有结果7
keyLength = possibleKeyLengths[0]

//找出key
let key = {}
let key1 = Buffer.alloc(keyLength)
for (let index = 0; index < keyLength; index++) {
    let trys = []
    for (let j = index; j < cipher.length; j += keyLength) {
        trys.push(cipher[j])
    }
    for (let k = 0; k <= 0xFF; k++) {
        let flag = true
        for (let i in trys) {
            const a = trys[i] ^ k
            if (!acceptPlainText.includes(String.fromCharCode(a))) {
                flag = false
                break
            }
        }
        if (flag) {
            console.log(index + "might key: " + k)
            if (!key[index]) key[index] = []
            key[index].push(k)
        }
    }
}
for (let i in key) {
    key1[i] = key[i][0]
}
console.log("key: ", key1.toString("hex"))
const plain = decrypt(cipher, key1)
console.log("plain text:" + plain.toString())