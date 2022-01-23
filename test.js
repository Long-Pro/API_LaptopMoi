const bcrypt = require('bcrypt');
const saltRounds = 10;
// const myPlaintextPassword = '000000';
// const someOtherPlaintextPassword = '222';


const hash = bcrypt.hashSync('00000000', saltRounds);
console.log(hash)
// const hash2 = bcrypt.hashSync(myPlaintextPassword, saltRounds);
// console.log(hash2)
// let x=bcrypt.compareSync(myPlaintextPassword, hash); // true
// console.log(x)
// x=bcrypt.compareSync(someOtherPlaintextPassword, hash); // false
// console.log(x)


// var jwt = require('jsonwebtoken');
// const i = jwt.sign({ foo: 'bar' }, 'shhhhh',{expiresIn:30});
// console.log(i)
// var t='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE2NDIwNTU3OTUsImV4cCI6MTY0MjA1NTgyNX0.KoDFKQOBz6jONyXK8WSMfI09etmOU4iFLtHgFbgT498'
// var decoded = jwt.verify(t, 'shhhhh');
// console.log(decoded)



