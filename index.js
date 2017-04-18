const spawn = require('child_process').spawn;
const flatten = require('object-iron');

function generateXFDF(data) {
	let	val;
	const form = flatten(data);
	const header = (String.fromCharCode(226))
		+ (String.fromCharCode(227))
		+ (String.fromCharCode(207))
		+ (String.fromCharCode(211));

	data = `%FDF-1.2\n%${header}\n1 0 obj\n<<\n/FDF\n<<\n/Fields [`;
	Object.keys(form).forEach((field) => {
		val = form[field];
		if (Object.prototype.hasOwnProperty.call(form, field)) {
			data += `<<\n/V(${val})\n/T(${field})\n>>`;
		}
	});
	data += ']\n>>\n>>\nendobj\ntrailer\n\n<<\n/Root 1 0 R\n>>\n%%EOF';
	return data;
}

module.exports.fillForm = function (data, fillablePDF, callback) {
	const fdfData = generateXFDF(data);

	const child = spawn('pdftk', [fillablePDF, 'fill_form', '-', 'output', '-', 'flatten']);

	const chunks = []; // Pipe FDF generated data to process' stdin
	const err_chunks = [];
	child.stdin.write(Buffer.from(fdfData, 'utf-8'));
	child.stdin.end();
	child.on('err', err => callback(err));
	child.stderr.on('data', (res) => {
		err_chunks.push(res);
	});

	child.stdout.on('data', (res) => {
		// console.log(res.toString('ascii'));
		// console.log("===============================")
		chunks.push(res);
	});

	child.on('exit', code => callback(err_chunks, code, Buffer.concat(chunks)));
};
