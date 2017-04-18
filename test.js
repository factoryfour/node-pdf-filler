const { fillForm } = require('./index');
const fs = require('fs');

const inputJSON = {
	Text1: 'Billy',
	Group3: 'Choice1',
	CheckBox2: 'Yes',
	Group4: 'Choice2',
	CheckBox3: 'Yes',
	'Check Box4': 'Off',
	Group5: 'Choice1'
};
fillForm(inputJSON, __dirname + '/demo_files/ctest.pdf', function (err, code, res) {
	console.log(err.toString('ascii'));
	console.log(code);
	console.log(res.toString('ascii'));
	fs.writeFile('Test.pdf', res);
});
