import ProxyRotator from '../index.js'
import assert from 'assert';
import chai from 'chai';
const expect = chai.expect

//slogan: when you like a little risk with you proxies

// check if i 
describe('being able to process different types of proxies inputs', () => {
    // test if it can process a string point to a file
    // make rotator with file with newlines
    let proxies_file = './assets/http_proxies_with_newlines.txt';
    let rotator_with_newlines = new ProxyRotator(proxies_file); 
    // make rotator with file with spaces
    //let proxies_file = './assets/http_proxies_with_spaces.txt';
    //let rotator_with_spaces = new ProxyRotator(proxies_file);
    // make rotator with file with commas
    //proxies_file = './assets/http_proxies_with_commas.txt';
    //let rotator_with_commans = new ProxyRotator(proxies_file);
    it('reading file with newlines', () => {
        let value = checklist._checklist.get(JSON.stringify(values[1]))
        assert.equal(value , true)
    })
});

    /*
    // isChecked
    it('isCheck()', () => 
        assert.equal(checklist.isChecked(values[1]), true)
    )
    // values done
    it('valuesDone()', () => 
        assert.equal(checklist.valuesDone(), 1)
    )
    // get checked values
    it('getcheckedValues()', () => {
        assert.deepEqual(
            checklist.getCheckedValues(), 
            values.filter(e => e === values[1])
        )
    })
    // get missing values
    it('getMissingValues()', () => {
        assert.deepEqual( 
            checklist.getMissingValues(),
            values.filter(e => e !== values[1])
        )
    })
    // missing left()
    it('missingLeft()', () => 
        assert.equal(checklist.missingLeft(), 4)
    )
    // next missing()
    it('next()', () => 
        assert.equal(checklist.next(), values[0])
    )
    // uncheck
    it('uncheck()', () => {
        checklist.uncheck(values[1])
        assert.equal(checklist.isChecked(values[1]), false)
    })
    // getValues
    it('getValues()', () => {
        assert.deepEqual(checklist.getValues(), values)
    })
    // valuesCount
    it('valuesCount()', () => {
        assert.equal(checklist.valuesCount(), 5)
    })
    // add
    it('add()', () => {
        checklist.add(other_values[0])
        expect(checklist.getValues()).to.include(other_values[0])
    })
    // remove
    it('remove()', () => {
        checklist.remove(other_values[0])
        expect(checklist.getValues()).to.not.include(other_values[0])
    })
    // isDone
    it('isDone()', () => 
        expect(checklist.isDone()).to.equal(false)
    )
    // isNotDone
    it('isNotDone()', () => 
        expect(checklist.isNotDone()).to.equal(true)
    )
    it('delete', () => { 
        checklist.delete();
        assert.deepEqual(checklist.getValues(), []);
    })
});

// hashing values 
describe('hashing', () => {
    let values = [ '🥚 eggs', '🥩 ham', '🧀 cheese', '🍎 apple', '🥦 broccoli' ];
    let values_unsorted = [ '🥩 ham', '🍎 apple', '🧀 cheese',  '🥦 broccoli', '🥚 eggs' ];
    let checklist = new Checklist(values);
    checklist.check(values[1]);
    it('checking same values array', () => { 
        let checklist1 = new Checklist(values);
        assert(checklist.isChecked(values[1]), true)
    })
    it('difrently sorted array', () => { 
        let checklist1 = new Checklist(values_unsorted);
        assert(checklist.isChecked(values[1]), true)
    })
    it('delete', () => { 
        checklist.delete();
        assert.deepEqual(checklist.getValues(), []);
    })
});

// test multiple values
describe('adding and removing multiple values', () => {
    let values = [ '🥚 eggs', '🥩 ham', '🧀 cheese', '🍎 apple', '🥦 broccoli' ];
    let add_values = [ '🥓 bacon', '🍞 Bread', '🍆 Eggplant', '🥛 Milk']
    let remove_values = [  '🥚 eggs', '🥩 ham', '🥓 bacon', '🍞 Bread', '🥛 Milk']
    let checklist = new Checklist(values, { name: 'adding_removing' });
    it('adding multiple', () => { 
        checklist.add(add_values)
        assert.deepEqual( 
            checklist.getValues(), 
            values.concat(add_values)
        )
    })
    it('remove multiple', () => { 
        checklist.remove(remove_values)
        assert.deepEqual( 
            checklist.getValues(), 
            values.concat(add_values).filter(e => !remove_values.includes(e))
        )
    })
    it('check multiple', () => { 
        checklist.check(
            values.concat(add_values).filter(e => !remove_values.includes(e))
        );
        assert.equal(checklist.isDone(), true)
    })
    it('uncheck multiple', () => { 
        checklist.uncheck(
            values.concat(add_values).filter(e => !remove_values.includes(e))
        );
        assert.deepEqual( 
            checklist.getMissingValues(), 
            values.concat(add_values).filter(e => !remove_values.includes(e))
        );
    })
    it('delete', () => { 
        checklist.delete();
        assert.deepEqual(checklist.next(), undefined);
    })
});

// finishing check list
describe('finishing checklist', () => {
    let values = [ '🥚 eggs', '🥩 ham', '🧀 cheese', '🍎 apple', '🥦 broccoli' ];
    let checklist = new Checklist(values, { name: 'finishing_values'});
    it('next()', () => { 
        let value = checklist.next();
        checklist.check(value);
        assert.equal(value, values[0]);
    });
    it('next()', () => { 
        let value = checklist.next();
        checklist.check(value);
        assert.equal(value, values[1]);
    });
    it('next()', () => { 
        let value = checklist.next();
        checklist.check(value);
        assert.equal(value, values[2]);
    });
    it('next()', () => { 
        let value = checklist.next();
        checklist.check(value);
        assert.equal(value, values[3]);
    });
    it('next()', () => { 
        let value = checklist.next();
        checklist.check(value);
        assert.equal(value, values[4]);
    });
    it('next()', () => { 
        let value = checklist.next();
        checklist.check(value);
        assert.equal(value, undefined);
    });
    it('isDone()', () => 
        assert.equal(checklist.isDone(), true)
    );
    it('delete', () => { 
        checklist.delete();
        assert.deepEqual(checklist.next(), undefined);
    })
});

// keeping file object
describe('check that it returns the object that it got as a input', () => {
    let values = [ {'eggs': '🥚'}, ['🥩 ham', '🧀 cheese'], '🍎 apple', 100, 0.4 ];
    let checklist = new Checklist([]);
    it('return object', () => { 
        checklist.add(values[0]);
        let value = checklist.next();
        checklist.check(value);
        assert.deepEqual(value, values[0]);
    });
    it('return list', () => { 
        checklist.add([values[1]]);
        let value = checklist.next();
        checklist.check([value]);
        assert.deepEqual(value, values[1]);
    });
    it('return string', () => { 
        checklist.add(values[2]);
        let value = checklist.next();
        checklist.check(value);
        assert.deepEqual(value, values[2]);
    });
    it('return int', () => { 
        checklist.add(values[3]);
        let value = checklist.next();
        checklist.check(value);
        assert.deepEqual(value, values[3]);
    });
    it('return float', () => { 
        checklist.add(values[4]);
        let value = checklist.next();
        checklist.check(value);
        assert.deepEqual(value, values[4]);
    });
    it('delete', () => { 
        checklist.delete();
        assert.deepEqual(checklist.next(), undefined);
    })
});

// test recalc on check
describe('recalc_on_check option', () => {
    describe('recalc_on_check is false', () => {
        let values = [ '🥚 eggs', '🥩 ham', '🧀 cheese', '🍎 apple', '🥦 broccoli' ];
        let checklist = new Checklist(values, { 
            name: 'recalc_on_check',
            recalc_on_check: false
        });
        let value0 = checklist.next();
        let value1 = checklist.next();
        let value2 = checklist.next();
        checklist.check(value1);
        it('next()', () => { 
            let value = checklist.next();
            assert.equal(value, values[3]);
        });
        it('next()', () => { 
            checklist.check(value2);
            let value = checklist.next();
            assert.equal(value, values[4]);
        });
        it('delete', () => { 
            checklist.delete();
            assert.deepEqual(checklist.next(), undefined);
        })
    });
    describe('recalc_on_check is true', () => {
        let values = [ '🥚 eggs', '🥩 ham', '🧀 cheese', '🍎 apple', '🥦 broccoli' ];
        let checklist = new Checklist(values, { 
            name: 'recalc_on_check',
            recalc_on_check: true
        });
        let value0 = checklist.next();
        let value1 = checklist.next();
        let value2 = checklist.next();
        checklist.check(value1);
        it('next()', () => { 
            let value = checklist.next();
            assert.equal(value, values[0]);
        });
        it('next()', () => { 
            checklist.check(value2);
            let value = checklist.next();
            assert.equal(value, values[0]);
        });
        it('delete', () => { 
            checklist.delete();
            assert.deepEqual(checklist.next(), undefined);
        })
    });
});

// test printing and logging
describe('test printing and logging', () => {
    let values = [ '🥚 eggs', '🥩 ham', '🧀 cheese', '🍎 apple', '🥦 broccoli' ];
    let checklist = new Checklist(values, { 
        name: 'print_and_log',
    });
    // check that the toString() method works
    let value0 = checklist.next();
    let value1 = checklist.next();
    let value2 = checklist.next();
    let value3 = checklist.next();
    checklist.check(value0);
    checklist.check(value1, "ham");
    checklist.check(value2, {obj: "cheese"});
    checklist.check(value3, 12);
    //console.log(checklist.toString());
    it('toString()', () => { 
        let str = checklist.toString();
        // split by line
        str.split('\n')
            .forEach((entry, index) => {
                let [ key, value ] = entry.split(':');
                if(value){
                    value = value.trim();
                    if (index == 0) {  
                        assert.equal(value, '✅');
                    } else if (index == 1) {
                        assert.equal(value, "ham");
                    } else if (index == 2) {
                        assert.equal(value, "[object Object]");
                    } else if (index == 3) {
                        assert.equal(value, '12')
                    } else if (index == 4) {
                        assert.equal(value, '❌');
                    }
                }
            });
    });
    // delete the checklist
    it('delete', () => { 
        checklist.delete();
        assert.deepEqual(checklist.next(), undefined);
    })
});

// test printing and logging
describe('test ability to process a ludicrous amount of items', () => {
    // make an array with a 10 million items with the string of each number
    let values;
    let checklist;
    let maximun = Math.pow(2,24);
    before('Making an Array of 10 million items', function(done) {
        this.timeout(10000);
        // set a hook-level timeout
        values = Array(maximun).fill().map((_, i) => i.toString());
        done();
    })
    // make a checklist with the array
    it('making a checklist of 10 million should take less than 200645ms', function(done) {
        // set a test-level timeout
        this.timeout(200645);
        //setTimeout(done, 150);
        checklist = new Checklist(values, { 
            name: 'ludicrous amount of items',
            recalc_on_check: false,
            save_every_check: 5,
        });
        done();
    })
    // check some values with array
    it('Checking without saving', function(done) {
        this.timeout(100);
        // get a random value between 0 and maximun
        checklist.check(values[Math.floor(Math.random() * maximun)]);
        checklist.check(values[Math.floor(Math.random() * maximun)]);
        checklist.check(values[Math.floor(Math.random() * maximun)]);
        checklist.check(values[Math.floor(Math.random() * maximun)]);
        done();
    })
    // check so
    it('Checking an item with saving', function(done) {
        this.timeout(10 * 1000);
        // get a random value between 0 and maximun
        checklist.check(values[Math.floor(Math.random() * maximun)]);
        done();
    })
    // delete the checklist
    it('delete', () => { 
        checklist.delete();
        assert.deepEqual(checklist.next(), undefined);
    })
});
*/
