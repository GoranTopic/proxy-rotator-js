import { 
    write_json, 
    read_json, 
    delete_json, 
    file_exists,
    file_not_exists,
} from '../index.js'
import assert from 'assert';
// thisis done so that sync_fs tests are tun first
import './sync_fs.test.js'

let cwd = process.cwd() + '/test/files/';

let test_json = {
    label: 'test',
    number: 49,
    array: [ 's', 4, { s:'s' } ],
    obj: { a: [2,4,5], s: 's' },
}

// test reading filsystem
describe('json file system functions', () => {
    // write json file
    describe('write_json()', () => {
        it('save json to disk', () => {
            write_json(test_json, cwd + 'test.json');
            setTimeout(() => {}, 5000);
            assert.equal( file_exists( cwd + 'test.json'), true)
        })
    });
    // read json file
    describe('read_json()', () => {
        it('save json to disk', () => {
            let json = read_json(cwd + 'test.json');
            assert.deepEqual(json, test_json)
        })
    });
    // delete json file
    describe('delete_json()', () => {
        it('delete json file', () => {
            delete_json(cwd + 'test.json');
            setTimeout(() => {}, 5000);
            assert.equal( file_not_exists( cwd + 'test.json'), true)
        })
    });
});
