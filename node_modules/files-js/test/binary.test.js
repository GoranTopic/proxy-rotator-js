import { 
    read_binary,
    read_binary_to_binstr,
    write_binary,
    write_binstr,
    file_exists,
    file_not_exists,
    rm_file,
} from '../index.js'
import assert from 'assert';
// this is done so that sync_fs tests are tun first
import './sync_fs.test.js'
import './json.test.js'

let cwd = process.cwd() + '/test/files/';

let buffer, bin_str 

// test binary
describe('binary test', () => {
    // read binary file
    describe('read_binary()', () => {
        it('read pdf file to buffer', () => {
            buffer = read_binary(cwd + 'file2.pdf');
            assert.equal(typeof buffer, 'object') 
        })
    });
    // write binary file
    describe('write_binary()', () => {
        it('write pdf buffer to file', () => {
            write_binary(buffer, cwd + 'file2.pdf');
        })
    });

    // read binary to bin string
    describe('read_binary_to_binstr()', () => {
        it('read pdf file to binary string', () => {
            bin_str = read_binary_to_binstr(cwd + 'file1.jpg');
            assert.equal(typeof bin_str, 'string') 
        })
    });
    // write binary file
    describe('write_binstr()', () => {
        it('write pdf file', () => {
            write_binstr(bin_str, cwd + 'file1.jpg');
        })
    });

    
});
