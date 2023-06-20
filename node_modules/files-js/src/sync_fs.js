import fs from 'fs'

/**
 * fileExists.
 *
 * @param {String} path
 */
const file_exists = path =>{
    try{
        return fs.existsSync(path)
    }catch(e) {
        console.error('could not find file ' + e);
        return false
    }
}

/**
 * fileNotExists.
 *
 * @param {String} path
 */
const file_not_exists = path => 
    !fs.existsSync(path)

/**
 * ls_dir
 * list all file from directory path
 * this function returns a list of all values from a direstory
 *
 * @param String path
 */
const ls_dir = path =>
  fs.readdirSync(path, { withFileTypes: true })
    .map(dirent => dirent.name)

/**
 * list directories.
 * this function returns a list of directoris with in the passed directory
 *
 * @param String path
 */
const ls_dirs = path =>
  fs.readdirSync(path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

/**
 * list all files in directory
 * this function returns a list of files with in the passed directory
 *
 * @param String path
 */
const ls_files = path =>
    fs.readdirSync(path, { withFileTypes: true })
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name)

/**
 * mkdir.
 * this is a humble function that make a directory that is passed
 * if creates the directories recursibly
 *
 * @param {string} path to directory
 * relative paths are from the current working dir
 * ex:./data/mined/companies
 */
const mkdir = path => 
    // If current directory does not exist then create it
    fs.mkdir(path, { recursive: true }, error => {
        if(error) console.error(error)
    });

/**
 * write_file
 * this is a humble function that make a file a writes a string on it
 *
 * @param {string} path to directory
 * @param {string} string to be written
 *
 **/
const write_file = (path, string = '') => 
    fs.writeFileSync(path, string);

/**
 * read_file
 * reads a text from a file returns as a string
 *
 * @param {string} path to directory
 *
 **/
const read_file = path => 
    fs.readFileSync(path,{ encoding: 'utf8' });

/**
 * mv
 * remove an file
 *
 * @param {String} from_path
 * @param {String} to_path
 */
const mv = (from_path, to_path) =>
    fs.renameSync(from_path, to_path);

/**
 * rm_file
 * remove an file
 *
 * @param {String} path
 */
const rm_file = path =>
    fs.unlinkSync(path)


/**
 * rm_dir
 * remove an directory, with options can be passed
 *
 * @param {String} path
 * @obj {
 *   recursive: 
 *   } options
 */
const rm_dir = 
    (path, options = { recursive: true, force: true } ) =>
    fs.rmSync(path, options );


export { 
    file_exists,
    file_not_exists,
    ls_dir,
    ls_dirs,
    ls_files,
    mkdir,
    write_file,
    read_file,
    mv,
    rm_file,
    rm_dir,
}


