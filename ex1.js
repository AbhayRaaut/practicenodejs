#!/usr/bin/env node

"use strict";
var util = require("util");
var getstdin = require("get-stdin");
var path = require("path");
var fs = require("fs");
var args = require("minimist")(process.argv.slice(2),{
    boolean : ["help"],
    string : ["file"],
});
// console.log(args);


var base_path = path.resolve(
    process.env.base_path || __dirname
);
// if (process.env.hello){
//     console.log(process.env.hello);
// }

// console.log(process.argv.slice(2));
if (args.help){
    printhelp();
}
else if (args.in || args._.includes("-")){
    getstdin().then(processfile).catch(error);
}
else if (args.file){
    fs.readFile(path.join(base_path,args.file),function onContents(err, contents){
        if(err){
            error(err.toString());
        }
        else{
            processfile(contents.toString());
        }
    });
//     contents = contents.toString().toUpperCase();
//     console.log(contents);
}
else {
    error("incorrect use of arguments", true);
}

function processfile(contents){
    process.stdout.write(contents.toUpperCase());
}


function error(msg,needhelp = false){
    console.log(msg);
    if (needhelp){
        printhelp();
    }
}


function printhelp(){
console.log("Oh my god help me");
console.log("*********************");
console.error("I am so deaddddddddddddddddddddddd");
}