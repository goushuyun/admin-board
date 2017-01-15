function testMobile(tel){
    let telReg = /^1\d{10}$/
    return telReg.test(tel)
}

function testPassword(pwd){
    let pwdReg = /^[A-Za-z0-9]{6,20}$/
    return pwdReg.test(pwd)
}

function getTimeVal(){
    var date = new Date()
    return date.getSeconds()
}


export {testMobile, testPassword, getTimeVal}
