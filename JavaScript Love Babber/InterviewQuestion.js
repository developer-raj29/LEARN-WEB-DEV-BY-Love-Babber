// let arr = [0, 1, 2, 3, 4, 5, 6];

// arr.length = 4;
// console.log(arr);

// let arr = [0, 1, 2, 3, 4, 5, 6];

// console.log(arr.slice(4));

// let arr = [1, 1, 2, 2, 3, 3, 4, 4, 5, 6];

// let uniqueArr = [...new Set(arr)];

// console.log(uniqueArr);

//************************************************************************************************************
//                       Remove Duplicate Number in array
//*************************************************************************************************************
// let arr = [1, 2, 1, 3, 3, 4, 4];

// arr.filter((value, index) => {
//   if (index === arr.indexOf(value)) {
//     console.log(value);
//   }
// });

//************************************************************************************************************
//                       Print Reverse String with space and without spaces
//*************************************************************************************************************
// Approch 1
// function reverseString(str) {
//   console.log(str.split("").reverse().join(""));
// }

// reverseString("Raj Yadav");

// Approch 2
// const str = "Raj Yadav";

// const op = str.split("").reverse();
// const withoutSpace = [];

// op.filter((val, index) => {
//   if (val !== " ") {
//     // remove space from array
//     withoutSpace.push(val);
//   }
// });

// console.log(withoutSpace.join("")); // vadaYjaR
// console.log(op.join("")); //  vadaY jaR

//************************************************************************************************************
//                       Find Even and Odd Number in array
//*************************************************************************************************************
// let arr = [1, 3, 2, 4, 5, 6];

// for (let i = 0; i < arr.length; i++) {
//   if (arr[i] % 2 == 0) {
//     console.log(arr[i] + "is even");
//   } else {
//     console.log(arr[i] + "is odd");
//   }
// }

//************************************************************************************************************
//                       Remove Duplicate char in string without spaces
//*************************************************************************************************************
// Approch 1
// let str = "welcome to webkrops for new position";
// // op = ['w', 'e', 'l', 'c','o','m','t','b','k','r','p','s','f','n','i'];

// const op = str.split(""); // Split the string into an array of characters
// const singleChar = []; // empty array

// op.filter((val, index) => {
//   if (index === op.indexOf(val) && val !== " ") {
//     // console.log(index + " : " + op.indexOf(val));
//     singleChar.push(val, index); // push single character and their index value in singleChar
//   }
// });

// console.log(singleChar); // print your output
// console.log(op);

// Approch 2
// let str = "welcome to webkrops for new position";

// // Step 1: Split the string into an array of characters
// let charArray = str.split("");

// // Step 2: Filter out the spaces
// let filteredArray = charArray.filter((char) => char !== " ");

// // Step 3: Create a Set to get unique characters
// let uniqueCharsSet = new Set(filteredArray);

// // Step 4: Convert the Set back to an array
// let uniqueCharsArray = Array.from(uniqueCharsSet);

// console.log(uniqueCharsArray); // ["w", "e", "l", "c", "o", "m", "t", "b", "k", "r", "p", "s", "f", "n", "i"];

//************************************************************************************************************
//                       Letter Count in long string without spaces
//*************************************************************************************************************
// let str = "welcome to webkrops";

// let op = str.split(""); // Split the string into an array of characters
// let letterCounts = []; // Object to store the count of each letter

// for (let i = 0; i < op.length; i++) {
//   let char = op[i];
//   if (char !== " ") {
//     // Skip spaces
//     if (letterCounts[char]) {
//       letterCounts[char]++;
//     } else {
//       letterCounts[char] = 1;
//     }
//   }
// }

// Printing the counts
// for (let char in letterCounts) {
// //   console.log("character : " + char + " : " + letterCounts[char]);
// }

// console.log(letterCounts);

// countLetter("welcome to webkrops");
// countLetter("Raj Yadav");

//*************************************************************************************************************

//************************************************************************************************************
//                       Convert To Boolean
//*************************************************************************************************************

const isTrue = !0;
const alsoFalse = !!0;

console.log("isTrue : " + isTrue);
console.log("alsoFalse : " + alsoFalse);
console.log("alsoFalse : " + typeof alsoFalse);
