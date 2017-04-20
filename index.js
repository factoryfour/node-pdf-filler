const spawn = require('child_process').spawn;
const flatten = require('object-iron');


function generateXFDF(data) {
	const form = flatten(data);
	const header = `${String.fromCharCode(226)}${String.fromCharCode(227)}${String.fromCharCode(207)}${String.fromCharCode(211)}`;
	const initial = `%FDF-1.2\n%${header}\n1 0 obj\n<<\n/FDF\n<<\n/Fields [`;
	const reducer = (accumulator, currentField) => `${accumulator}<<\n/V(${form[currentField]})\n/T(${currentField})\n>>`;
	const build = Object.keys(form).reduce(reducer, initial);
	const end = `${build}]\n>>\n>>\nendobj\ntrailer\n\n<<\n/Root 1 0 R\n>>\n%%EOF`;
	return end;
}


module.exports.fillForm = (data, fillablePDF, callback) => {
	const fdfData = generateXFDF(data);
	const child = spawn('pdftk', [fillablePDF, 'fill_form', '-', 'output', '-', 'flatten']);
	const chunks = []; // Pipe FDF generated data to process' stdin
	const errChunks = [];
	child.stdin.write(Buffer.from(fdfData, 'utf-8'));
	child.stdin.end();
	child.on('err', err => callback(err));
	// child.stderr.on('data', errChunk => errChunks.push(errChunk));
	child.stdout.on('data', (chunk) => {
		console.log(chunk.toString('ascii'));
		console.log('===============================');
		chunks.push(chunk);
	});
	child.on('exit', code => callback(errChunks, code, Buffer.concat(chunks)));
};

/*
//Example running of fillForm:
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
*/
