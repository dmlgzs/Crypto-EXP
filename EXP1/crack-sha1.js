const sha1 = (data) => require("crypto").createHash("sha1").update(data).digest("hex")

const keyboardMap = "(QqWwIiNn*=5802468%([=}@+"
const pwdLength = 8
const crack = (pwd = "") =>{
    let pwd1 = pwd
    for (let a of keyboardMap){
        pwd1 = pwd + a
        if (pwd1.length === pwdLength) {
        const sha = sha1(pwd1)
        console.log(pwd1,sha)
            if (sha === "67ae1a64661ac8b4494666f58c4822408dd0a3e4") {
                console.log("found pwd:", pwd1)
                process.exit()
            }
        } else {
            crack(pwd1)
        }
    }
}
crack("")