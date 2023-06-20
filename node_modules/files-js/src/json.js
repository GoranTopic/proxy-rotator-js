import fs from 'fs'
/*
 * this are the format files to handle json files
 */

/**
 * write_json.
 *
 * @param {} obj
 * @param {} path
 */
const write_json = (obj, path, options={}) => {
    let quiet = options.quiet ?? true;
    try{
        let str = JSON.stringify(obj)
        fs.writeFileSync(path, str);
        return true
    }catch(e) {
        if(quiet) return false
        else throw e;
    }
}

/**
 * read_json.
 *
 * @param {} path
 */
const read_json = (path, options={}) => {
    let quiet = options.quiet ?? true;
    try{
        let str = fs.readFileSync(path);
        return JSON.parse(str)
    }catch(e) {
        if(quiet) return false
        else throw e;
    }
}

/**
 * delete_json.
 *
 * @param {} path
 */
const delete_json = (path, options={}) => {
    let quiet = options.quiet ?? true;
    try{
        return fs.unlinkSync(path);
    }catch(e) {
        if(quiet) return false
        else throw e;
    }
}

export { 
    write_json,
    read_json,
    delete_json,
}


