#! /usr/bin/env node

var shell = require("shelljs");
var cliArgs = require("command-line-args");
var babel = require("babel-core");
var fs = require('fs');


/* define the command-line options */
var cli = cliArgs([
    { name: "verbose", type: Boolean, alias: "v", description: "Write plenty output" },
    { name: "help", type: Boolean, description: "Print usage instructions" },
    { name: "folder", type: String, description: "Folder to point babel at" },
    { name: "files", type: Array, defaultOption: true, description: "The input files" },
    { name: "out", type: String, description: "Output folder" }
]);
 
/* parse the supplied command-line values */
var options = cli.parse();
 
/* generate a usage guide */
var usage = cli.getUsage({
    header: "An app that will conver the newest version of esscript to current popular implementation levels.",
    footer: "For more information, visit heaven. They have cookies."
});

var print = function (fill) {
//    var strOut = fill.toString();
    console.log(fill);
//    shell.exec("echo 'ech'o: " + fill + " works");
};
var printHelp = function () {
    console.log(usage);
};

// console.log("Formatted options :" + JSON.stringify(options));
// console.log(options);
//print(options);
//printHelp();

var output_folder = options.out ? options.out : "./babel-es5-src"; 
var verbose = options.verbose ? true : false;

if (options.help) {
    printHelp();
} else {
    fs.mkdir(output_folder, function (err) {
	if (verbose) console.error(err);
    });
    if (verbose)
	print(options);
    
    if (options.folder) {
	shell.exec("babel -d " + output_folder + " " + options.folder);
    }
    else if (options.files) {
	options.files.forEach(function(f) {
	    if (verbose)
		console.log("Current file: " + f);
	    babel.transformFile(f, function (err, result) {
		if (err) {
		    return console.error(err);
		} else {
		    if (verbose)
			console.log("WE HAVE A RESULT");

		    var newFilePath = output_folder + "/" + f;
		    var newFile = fs.open(output_folder + "/" + f,'w',
			function (err, descriptor) {
			    fs.write(descriptor, result.code, function (err, buff, data) {
				if (err) {
				    return console.error(err);
				} else {
				    return console.log("the file was written");
				}
			    });
			});    
		}
	    });
	});
    }
}
