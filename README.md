Proxy Roulette
=======
#### 

## Installation
```
npm install proxy-roulette
```
## Usage
```javascript
import ProxyRoulette from 'proxy-roulette'

const shoppingList = [ 
  '🥚 eggs', 
  '🥩 ham', 
  '🧀 cheese', 
  '🍎 apple', 
  '🥦 broccoli' 
];

// create a checklist
const checklist = new Checklist(shopping_lits);

let eggs = await fetch('https://emojipedia.org/egg/');
// check eggs
if(eggs) checklist.check('🥚 eggs');

let ham = await fetch('https://emojipedia.org/ham/');
// check ham
if(ham) checklist.check('🥩 ham');

checklist.next() // '🧀 cheese'

checklist.next() // '🍎 apple'

// uncheck 🥚 eggs
checklist.uncheck('🥚 eggs')

/* 🥚 eggs ? */
checklist.isChecked('🥚 eggs') // false

/* 🥩 ham ? */
checklist.isChecked('🥚 eggs') // true

/*[ 
  '🥚 eggs', 
  '🧀 cheese',
  '🍎 apple',
  '🥦 broccoli',
]*/
checklist.getMissingValues();
checklist.getMissingLeft(); // 4

/*[ 
  '🥩 ham',
]*/
checklist.getCheckedValues()
checklist.valuesDone() // 1

/* check if all the values have been checked */
checklist.isDone() // false
checklist.isNotDone() // true

/*
false : 🥚 eggs 
true : 🥩 ham
false : 🧀 cheese
false : 🍎 apple
false : 🥦 broccoli
*/
checklist.log()

// delete the checklist in the files system
checklist.delete()
```
#### while loop usage
```javascript
while(checklist.isNotDone()){
  // get the next missing value on the checklist
  let value  = checklist.next()
  // perform some operation 
  let result = await fetch('https://emojipedia.org/');
  // check the value if successful
  if(result) checklist.check(value);
}

// delete the checklist in the files system
if(checklist.isDone())
  checklist.delete()
```


Permenance
====
#### you can recover the same checklist by creating it again with the same values
```javascript
const checklist = new Checklist([ 
  '🥚 eggs', 
  '🥩 ham',  
  '🥦 broccoli' 
]);

// check
checklist.check('🥚 eggs');
checklist.check('🥩 ham');

/*
true : 🥚 eggs 
true : 🥩 ham
false : 🥦 broccoli
*/
checklist.log()

```
```javascript
/* after crash or diffrent file*/
const checklist = new Checklist([ 
  '🥚 eggs', 
  '🥩 ham',  
  '🥦 broccoli' 
]);

/*
true : 🥚 eggs 
true : 🥩 ham
false : 🥦 broccoli
*/
checklist.log()
```
#### the order values does not matter when recovering the checklist
```javascript
/* after crash or diffrent file*/
const checklist = new Checklist([ 
  '🥦 broccoli' 
  '🥩 ham',
  '🥚 eggs', 
]);

/*
false : 🥦 broccoli 
true : 🥩 ham
true : 🥚 eggs
*/
checklist.log()
```
#### pass the name options to make it the checklist unique
```javascript
let shoppingList = [ 
  '🥦 broccoli' 
  '🥩 ham',
  '🥚 eggs', 
];

const bobs_checklist = new Checklist(
  shoppingList, { name: 'bobs shoppinglist' } 
);
bobs_checklist.check(['🥩 ham', '🥚 eggs'])

const alices_checklist = new Checklist(
  shoppingList, { name: 'alices shoppinglist' } 
);
alices_checklist.check('🥦 broccoli')

```
#### recover the checklist with the name option
```javascript
/* after crash or diffrent file*/
const bobs_checklist = 
  new Checklist(null, { name: 'bobs shoppinglist' });
  
/*
false : 🥦 broccoli 
true : 🥩 ham
true : 🥚 eggs
*/
bobs_checklist.log()

const alices_checklist = 
  new Checklist(null, { name: 'alices shoppinglist' });
  
/*
false : 🥦 broccoli 
true : 🥩 ham
true : 🥚 eggs
*/
bobs_checklist.log()
 ```
#### pass the path where to make the filesystem
```javascript 
  new Checklist([], { 
    name: 'my_checklist',
    path: process.cwd()
  });
  
 ```
### Recalculate missing values on Check
#### sometime when you are working with multiple concurrent processes you don't want the completion of one process to alter the order you would get the missing vlaue
#### this can lead to a missing values being drawn twice after a check. 
#### There is also the senario where you have too many values and doing recalc on every check will take too long
#### For this senarios you can set the option recalc_on_check to false
#### pass the path where to make the filesystem
```javascript 
  new Checklist([], { 
    recalc_on_check: false
  });
  
 ```
 
 Adding, Removing and Checking multiple values
====
```javascript
// add 🥓 bacon
checklist.add('🥓 bacon')
// or 
checklist.add(['🍞 Bread', '🍆 Eggplant', '🥛 Milk'])

// remove 🥚 eggs
checklist.remove('🥚 eggs')
// or 
checklist.remove(['🥩 ham', '🥓 bacon', '🍞 Bread', '🥛 Milk'])

// check 🧀 cheese
checklist.check('🧀 cheese')
// or 
checklist.check([ '🍆 Eggplant', '🍎 apple' , '🥦 broccoli'])

// uncheck 🧀 cheese
checklist.unchek('🧀 cheese')
// or 
checklist.uncheck([ '🍆 Eggplant', '🍎 apple' , '🥦 broccoli'])

```

