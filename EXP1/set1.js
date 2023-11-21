const Buffer = require("buffer").Buffer
const fs = require("fs")

const hex2b64 = (a) => Buffer.from(a, "hex").toString("base64")
console.log(hex2b64("49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d"))

const hexXor = (a, b) => {
    a = Buffer.from(a, "hex")
    b = Buffer.from(b, "hex")
    return a.map((c, i) => c ^ b[i]).toString("hex")
}
console.log(hexXor("1c0111001f010100061a024b53535009181c", "686974207468652062756c6c277320657965"))

const singleByteXor = (a, b) => {
    a = Buffer.from(a, "hex")
    b = Buffer.from(b)[0]
    return a.map((c, i) => c ^ b).toString()
}
console.log(singleByteXor("1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736", "X"))


const score = (str) => {
    const a = "a".charCodeAt(0)
    const z = "z".charCodeAt(0)
    const A = "A".charCodeAt(0)
    const Z = "Z".charCodeAt(0)
    str = Buffer.from(str)
    let score = 0
    for (let i = 0; i < str.length; i++) {
        if (str[i] >= A && str[i] <= Z) score++
        else if (str[i] >= a && str[i] <= z) score++
        else if (" ,.'?!\"".includes(String.fromCharCode(str[i]))) score++
        else score--
    }
    return score
}
const findKey = (a) => {
    let maxScore = 0
    let maxKey = 0
    for (let i = 0; i < 256; i++) {
        let tmp = singleByteXor(a, String.fromCharCode(i))
        let tmpScore = score(tmp)
        if (tmpScore > maxScore) {
            maxScore = tmpScore
            maxKey = i
        }
    }
    return maxKey
}
const crackSingleByteXor = (a) => {
    return singleByteXor(a, [findKey(a)])
}
console.log(crackSingleByteXor("1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736"))

const problem4 = fs.readFileSync("EXP1/4.txt").toString().split("\n").map((a) => a.trim())
let maxScore = 0
let ans = ""
for (let i in problem4) {
    const j = crackSingleByteXor(problem4[i])
    const sc = score(j)
    if (sc > maxScore) {
        maxScore = sc
        ans = j
    }
}
console.log(ans)

const repeatXor = (str, key) => {
    const _str = Buffer.from(str)
    const _key = Buffer.from(key)
    for (let i = 0; i < _str.length; i++) {
        _str[i] = _str[i] ^ _key[i % _key.length]
    }
    return _str
}
const problem5 = `Burning 'em, if you ain't quick and nimble
I go crazy when I hear a cymbal`
console.log(repeatXor(problem5, "ICE").toString("hex"))