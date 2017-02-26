const spawn = require('child_process').spawn;
const fs = require('fs');
const flatten = require("object-iron");

function fillForm(data, fillablePDF, callback) {
	var fdfData = generateXFDF(data);

	var child = spawn('pdftk', [fillablePDF, 'fill_form', '-', 'output', '-', 'flatten']);

	var chunks = []; // Pipe FDF generated data to process' stdin 
	var err_chunks = [];
	child.stdin.write(Buffer.from(fdfData,'utf-8'));
	child.stdin.end();
	child.on('err', function(err) {
		return callback(err);
	});
	child.stderr.on('data', function(data) {
		err_chunks.push(data)
	});
	child.stdout.on('data', function(data) {
		console.log(data.toString('ascii'));
		console.log("===============================")
		chunks.push(data);
	});
	child.on('exit', function(code) {
		return callback(err_chunks, code, Buffer.concat(chunks));
	});

}

function runCommand(callback) {
	// var fdfData = fdf.generate(jsonData);
	// var child = spawn('pdftk', [pdfFormPath, 'fill_form', '-', 'output', '-   ', 'flatten']);
	var child = spawn('pdftk', [__dirname + '/demo_files/ctest.pdf', 'dump_data_fields']);

	var chunks = []; // Pipe FDF generated data to process' stdin 
	var err_chunks = [];
	// child.stdin.write(fdfData);
	child.stdin.end();
	child.on('err', function(err) {
		return callback(err);
	});
	child.stderr.on('data', function(data) {
		err_chunks.push(data)
	});
	child.stdout.on('data', function(data) {
		console.log(data.toString('ascii'));
		console.log("===============================")
		chunks.push(data);
	});
	child.on('exit', function(code) {
		return callback(err_chunks, code, Buffer.concat(chunks));
	});
}

function parseFields(callback) {

	runCommand(function(err, code, success) {
		console.log(err);
		console.log(err.toString('ascii'))
		console.log(code);
		// console.log(success.toString('ascii'));

	});
}

function generateXFDF(data) {
    var field, form, header, val;
    form = flatten(data);
    header = (String.fromCharCode(226)) + (String.fromCharCode(227)) + (String.fromCharCode(207)) + (String.fromCharCode(211));
    data = "%FDF-1.2\n%" + header + "\n1 0 obj\n<<\n/FDF\n<<\n/Fields [";
    for (field in form) {
      val = form[field];
      if (form.hasOwnProperty(field)) {
        data += "<<\n/V(" + val + ")\n/T(" + field + ")\n>>";
      }
    }
    data += "]\n>>\n>>\nendobj\ntrailer\n\n<<\n/Root 1 0 R\n>>\n%%EOF";
    return data;
  };

//invoking
parseFields()

var inputJSON = {
	Text1: "Billy",
	Group3: "Choice1",
	CheckBox2: "Yes",
	Group4: "Choice2",
	CheckBox3: "Yes",
	"Check Box4": "Off",	
	Group5: "Choice1"
}

fillForm(inputJSON, __dirname + '/demo_files/ctest.pdf', function(err, code, res) {
	console.log(err.toString('ascii'));
	console.log(code);
	console.log(res.toString('ascii'));

	fs.writeFile("Test.pdf", res);
});

