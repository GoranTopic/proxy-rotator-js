import {
    file_exists,
    file_not_exists,
    ls_dir,
    ls_dirs,
    ls_files,
    mkdir,
    write_file,
    read_file,
    mv,
    rm_dir,
    rm_file
} from '../index.js'
import assert from 'assert';

let cwd = process.cwd() + '/test/files/';

const list = ['dir1', 'dir2', 'dir3', 'file1.jpg', 'file2.pdf', 'file3.json']
const dirs = ['dir1', 'dir2', 'dir3' ]
const files = ['file1.jpg', 'file2.pdf', 'file3.json']

// test reading filsystem
describe('file system functions', () => {
    // test fileExists
    describe('fileExists()', () => {
        let tests = [ 
            { 
                label: 'dir exists', 
                args: cwd + 'dir1', 
                expect: true 
            },{ 
                label: 'dir does not exists', 
                args: cwd + 'dir4', 
                expect: false 
            },{ 
                label: 'file exists', 
                args: cwd + 'file1.jpg', 
                expect: true 
            },{ 
                label: 'file does not exists', 
                args: cwd + 'file4.txt', 
                expect: false 
            },
        ];
        // run tests
        tests.forEach(({label, args, expect}) => 
            it(label, () => 
                assert.equal( file_exists(args), expect)
            )
        );
    });
    // test fileNotExists
    describe('file_not_exists()', () => {
        let tests = [ 
            { 
                label: 'dir exists', 
                args: cwd + 'dir1', 
                expect: false 
            },{ 
                label: 'dir does not exists', 
                args: cwd + 'dir4', 
                expect: true 
            },{ 
                label: 'file exists', 
                args: cwd + 'file1.jpg', 
                expect: false 
            },{ 
                label: 'file does not exists', 
                args: cwd + 'file4.txt', 
                expect: true 
            },
        ];
        // run tests
        tests.forEach(({label, args, expect}) => 
            it(label, () => 
                assert.equal( file_not_exists(args), expect)
            )
        );
    });
    // ls_dir
    describe('ls_dir()', () => 
        it('list directory', () => 
            assert.equal(JSON.stringify(ls_dir(cwd)), JSON.stringify(list))
        )
    );
    // ls_dirs
    describe('ls_dirs()', () => 
        it('list directories', () => 
            assert.equal(JSON.stringify(ls_dirs(cwd)), JSON.stringify(dirs))
        )
    );
    // ls_files
    describe('ls_files()', () => 
        it('list files', () => 
            assert.equal(JSON.stringify(ls_files(cwd)), JSON.stringify(files))
        )
    );
    // mkdir
    describe('mkdir()', () => 
        it('make directory', () => 
            assert.equal( (() => {
                mkdir(cwd + 'dir4');
                setTimeout(() => {}, 5000);
                return file_exists(cwd + 'dir4');
            })(), true )
        )
    );
    // write_file
    describe('write_file()', () => 
        it('write to new file', () => 
            assert.equal( (() => {
                write_file(cwd + 'file4.txt', 'hello world!');
                setTimeout(() => {}, 5000);
                return file_exists(cwd + 'file4.txt');
            })(), true )
        )
    );
    // read_file
    describe('read_file()', () => 
        it('read file created', () => 
            assert.equal( 
                read_file(cwd + 'file4.txt'), 
                'hello world!'
            )
        )
    );
    // mv ()
    describe('mv()', () => {
        it('move dir', () => 
            assert.equal( (() => {
                mv(cwd + 'dir4', cwd + 'dir5');
                setTimeout(() => {}, 5000);
                return file_not_exists(cwd + 'dir4') &&
                    file_exists(cwd + 'dir5');
            })(), true )
        )
        it('move file', () => 
            assert.equal( (() => {
                mv(cwd + 'file4.txt', cwd + 'file5.txt');
                setTimeout(() => {}, 5000);
                return file_not_exists(cwd + 'file4.txt') &&
                    file_exists(cwd + 'file5.txt');
            })(), true )
        )
    });
    // rm_dir
    describe('rm_dir()', () => 
        it('remove directory', () => 
            assert.equal( (() => {
                rm_dir(cwd + 'dir5');
                setTimeout(() => {}, 5000);
                return file_not_exists(cwd + 'dir5');
            })(), true )
        )
    );
    // rm_file
    describe('rm_file()', () => 
        it('remove file', () => 
            assert.equal( (() => {
                rm_file(cwd + 'file5.txt');
                setTimeout(() => {}, 5000);
                return file_not_exists(cwd + 'file5.txt');
            })(), true )
        )
    );
});
