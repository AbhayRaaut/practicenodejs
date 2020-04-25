#!/usr/bin/env node

"use strict";
var util = require("util");
// var getstdin = require("get-stdin");
var path = require("path");
var zlib = require("zlib");
var fs = require("fs");
var CAF = require("caf");
var Transform = require("stream").Transform;
var args = require("minimist")(process.argv.slice(2),{
    boolean : ["help","in","out","compress","uncompress"],
    string : ["file"],
});
// console.log(args);

processfile = CAF(processfile);

function streamCompletion(stream){
    return new Promise(function c(res){
        stream.on("end", res);
    });
}

var base_path = path.resolve(
    process.env.base_path || __dirname
);
// if (process.env.hello){
//     console.log(process.env.hello);
// }

var OUTFILE = path.join(base_path,"out.txt");


// console.log(process.argv.slice(2));
if (args.help){
    printhelp();
}
else if (args.in || args._.includes("-")){
    // getstdin().then(processfile).catch(error);
    let toolong = CAF.timeout(20, "\n ***Took to long to process!!!"); //toolong is the cancellation token
    processfile(toolong, process.stdin).catch(error);
}
else if (args.file){
    let stream = fs.createReadStream(path.join(base_path,args.file));
    let toolong = CAF.timeout(20, "\n ***Took to long to process!!!");
    
    processfile(toolong, stream)
    .then(function(){
    console.log("complete!");
    })
    .catch(error);

    // fs.readFile(path.join(base_path,args.file),function onContents(err, contents){
    //     if(err){
    //         error(err.toString());
    //     }
    //     else{
    //         processfile(contents.toString());
    //     }
    // });
//     contents = contents.toString().toUpperCase();
//     console.log(contents);
}
else {
    error("incorrect use of arguments", true);
}

function *processfile(signal, inStream){
    var outStream = inStream;

    if (args.uncompress){
        let gunzipStream = zlib.createGunzip();
        outStream = outStream.pipe(gunzipStream);
    }

    var upperStream = new Transform({
        transform(chunk,enc,cb){
            this.push(chunk.toString().toUpperCase());
            // setTimeout(cb,500);
            cb();
        }
    });
    outStream = outStream.pipe(upperStream);

    if (args.compress){
        let gzipStream = zlib.createGzip();
        outStream = outStream.pipe(gzipStream);
        OUTFILE = `${OUTFILE}.gz`;
    }

    var targetStream;
    if (args.out){
    targetStream = process.stdout;
    }
    else{
        targetStream = fs.createWriteStream(OUTFILE);
    }
    outStream.pipe(targetStream);

    signal.pr.catch(function f(){
        outStream.unpipe(targetStream); //unpiping what had been piped 
        outStream.destroy();           //destroying any stream remaining after the optimal time passes
    });

    yield streamCompletion(outStream);

}

// function processfile(contents){
//     process.stdout.write(contents.toUpperCase());
// }


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