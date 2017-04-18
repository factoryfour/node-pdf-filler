const filler = require('./index.js');
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

filler.fillForm(inputJSON, `${__dirname}/demo_files/atest.pdf`, (err, code, res) => {
	console.log(err.toString('ascii'));
	console.log(code);
	// console.log(res.toString('ascii'));

	fs.writeFile('btest.pdf', res);
});

