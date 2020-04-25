"use strict";

var args = require("minimist")(process.argv.slice(2),{
    boolean : ["help","in","out","compress"],
    string : ["request"],
});


if (args.request=="motivate me"){
    console.log("*****ROSES ARE RED***** \n*****VIOLETS ARE BLUE*****\n*****GO TO THE GYM!!!*****")
}