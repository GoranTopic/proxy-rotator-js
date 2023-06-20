# 

## My personal library to handle files in nodejs 

### Syncronous function

#### file_exists. 
```javascript
/*
returns true if file exists
@param {String} path
*/
file_exists(path)
```


#### file_not_exists.
```javascript
/*
@param {String} path
*/
file_not_exists(path)
```


#### ls_dir.
```javascript
/*
list all file from directory path
this function returns a list of all values from a directory
@param String path
*/
ls_dir(path)
```


#### ls_dirs.
```javascript
/*
list directories
this function returns a list of directoris with in the passed directory
@param String path
*/
ls_dirs(path)
```


#### ls_files.
```javascript
/*
list all files in directory
this function returns a list of files with in the passed directory
@param String path
*/
ls_files(path)
```


#### mkdir.
```javascript
/*
this is a humble function that make a directory that is passed
if creates the directories recursibly
@param {string} path to directory
relative paths are from the current working dir
ex:./data/mined/companies
*/
mkdir(path)
```


#### write_file.
```javascript
/*
this is a humble function that make a file a writes a string on it
@param {string} path to directory
@param {string} string to be written
*/
write_file((path, string = ''))
```


#### read_file.
```javascript
/*
reads a text from a file returns as a string
@param {string} path to directory
*/
read_file(path)
```


#### mv.
```javascript
/*
remove an file
@param {String} from_path
@param {String} to_path
*/
mv(from_path, to_path)
```


#### rm_file.
```javascript
/*
remove an file
@param {String} path
*/
rm_file(pat)
```


#### rm_dir.
```javascript
/*
remove an directory, with options can be passed
@param {String} path
@obj {
  recursive: true
  force: true
  } options
*/
rm_dir(path, options)
```
   
### Json Functions

#### write_json.
```javascript
/*
@param {} obj
@param {} path
*/
write_json(obj, path) 
```   

#### read_json.
```javascript
/*
@param {} path
*/
read_json(path)
```
   

#### delete_json.
```javascript
/*
@param {} path
*/
delete_json(path)
```

### Binary functions

#### read_binary.
```javascript
/*
this function reads a binary file from disk
return a binary buffer obj
@param {} path
*/
read_binary(path)
```


#### write_binary.
```javascript
/*
this function writes down a binary file to disk
from a binary buff
@param {} buff
@param {} path
*/
write_binary(buff, path)
```
   

#### write_binstr.
```javascript
/*
this function writes down a binary string to disk
@param {} bin_string
@param {} path
*/
write_binstr(bin_str, path)
```
