

// console.log("Hello mere bhaiyo or bheno");

// function EventListener() {
//   console.log("I haave click on event");
// }

// document.addEventListener("click", EventListener);

// Variable

// {
//   // let variable ko bs { } yee block of code me hi use kr skte hn
//   let a = 1;
//   let b = 2;
//   console.log(a + b);
// }
// console.log(a + b); // not Provide ans

// {
//   // const variable ko bs { } yee block of code me hi use kr skte hn
//   const a = 5;
//   const b = "5";

//   console.log(a + b);
// }

// {
//   // var ko kahi bhi use kr skte hn
//   var a = 1;
//   var b = 2;
// }
// console.log(a + b); // 3

// Equality ==  & strict equality ===

// let a = 5;
// let b = "5";
// console.log(a == b); // true check a value
// console.log(a === b); // false check a value or type

// Arithmetic Opreator

// let a = 10;
// let b = 5;

// console.log(a + b); // Addition 15
// console.log(a - b); // Substraction 5
// console.log(a * b); // Multiplication 50
// console.log(a / b); // Division 2
// console.log(a % b); // Modulus  0

// let x = 2;
// console.log(x ** 3); // 2*2*2 = 8
// console.log(x ** 5); // 2*2*2*2*2 = 32

// Relational Opreator

// let a = 10;
// let b = 5;

// console.log(a < b); // false
// console.log(a > b); // true
// console.log(a <= b); // false
// console.log(a >= b); // true

// Logical opreator

// AND = && when both value is true then ans is true.
// 1 * 1 = 1 , 0 * 0 = 0 , 0 * 1 = 0

// let a = 10;
// let b = 5;

// console.log(a > b && a < b); // false
// console.log(a < b && a > b); // false
// console.log(a > b && a > b); // true
// console.log(a < b && a < b); // false

// OR = || when one value is true ans is always true.
//  1 * 1 = 1 , 0 * 0 = 0 , 0 * 1 = 1

// let a = 10;
// let b = 5;

// console.log(a > b || a < b); // true
// console.log(a < b || a > b); // true
// console.log(a > b || a > b); // true
// console.log(a < b || a < b); // false

// Comparision :  += , -= , *= , /= , %=

// let a = 5;
// a += 1;
// console.log(a); // 6
// a -= 1;
// console.log(a); // 5
// a /= 1;
// console.log(a); // 5
// a *= 1;
// console.log(a); // 5
// a %= 1;
// console.log(a); // 0

// Increament & Drecreament Opreator

// Increament
// let x = 5;
// console.log(++x); // 6  pre - increment // phele increment then use
// console.log(x++); // 6  post - increment // phele use then increment

// Drecreament Opreator
// console.log(--x); // 4  pre - decrement // phele decrement then use
// console.log(x--); // 4 post - decrement // phele use then decrement

// Bit Wise Opreator & AND , | OR
// check a no. using binary language
// 0 = 0000 ; 1 = 0001 ; 2 = 0010 ; 3 = 0011 ; 4 = 0100 ; 5 = 0101
// 6 = 0110 ; 7 = 0111 ; 8 = 1000 ; 9 = 1001 ; 10 = 1010

// let a = 2;
// let b = 3;
// console.log(a & b); // 2
// console.log(a | b); // 3

// Conditional Statement

//  if , else-if , else

// let age = 14;

// if (age >= 18) {
//   console.log("your are adult");
// } else {
//   console.log("your are not adult");
// }

// if (age >= 18) {
//   console.log("your are adult");
// } else if (age >= 15) {
//   console.log("your are teen-ager");
// } else {
//   console.log("your are not adult");
// }

//  Switch Case statement

// switch (age) {
//   case 18:
//     console.log("adult");
//     break;
//   case 17:
//     console.log("teen-ager");
//     break;
//   case 16:
//     console.log("teen-ager");
//     break;
//   case 15:
//     console.log("teen-ager");
//     break;
//   default:
//     console.log("not adult");
// }

// Loops

// For loop

// let a;
// for (a = 1; a <= 5; a++) {
//   console.log(a); //  1 2 3 4 5
// }

// while loop

// let a = 1;
// while (a <= 5) {
//   console.log(a); //  1 2 3 4 5
//   a++;
// }

// do - while loop

// let a = 1;
// do {
//   console.log(a); //  1 2 3 4 5
//   a++;
// } while (a <= 5);
