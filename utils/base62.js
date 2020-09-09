const alphabets = process.env.BASE62_ALPHABETS;

exports.encode = function(num) {
    let encodedString = "";
    console.log(alphabets);
    console.log(num);
    while(num > 0){
        console.log(encodedString)
        encodedString = alphabets[num % 62] + encodedString;
        num = parseInt(num / 62);
    }

    return encodedString;
}

const decode = (chars) => {
    return chars.split('').reverse().reduce((prev, curr, i) =>
    prev + (alphabets.indexOf(curr) * (62 ** i)), 0)
}
 
const e =  function(num) {
    let encodedString = "";

    while(num > 0){
        encodedString = alphabets[num % 62] + encodedString;
        num = parseInt(num / 62);
    }

    return encodedString;
}