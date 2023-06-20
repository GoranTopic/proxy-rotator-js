import fs from 'fs'

/**
 * read_binary.
 * this function reads a binary file from disk
 * return a binary buffer obj
 *
 * @param {} path
 */
const read_binary = path => 
    fs.readFileSync(path)

/**
 * read_binary_to_binstr
 * this function reads a binary file from disk
 * return a buffer
 *
 * @param {} path
 */
const read_binary_to_binstr = path => 
    fs.readFileSync(path) 
        .toString('binary')

/**
 * write_binary.
 * this function writes down a binary file to disk
 * from a binary buff
 *
 * @param {} buff
 * @param {} path
 */
const write_binary = ( buff, path ) => {
    fs.writeFileSync(path, buff);
}

/**
 * write_binary_string.
 * this function writes down a binary string to disk
 *
 * @param {} bin_string
 * @param {} path
 */
const write_binstr = ( bin_str, path ) => {
    let bin_buffer = Buffer.from(bin_str, 'binary')
    fs.writeFileSync(path, bin_buffer);
}


export { read_binary, read_binary_to_binstr, write_binary, write_binstr }


