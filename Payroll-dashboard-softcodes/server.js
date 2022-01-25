const express = require('express');
require('dotenv').config();
const path = require('path');

const port = process.env.PORT || 9000;
const app = express();

app.use(express.static(`${__dirname}/build`));

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, './build/index.html'));
});

app.listen(process.env.PORT || 9000, () => {
	process.stdout.write(`Listening on port ${port}`);
});
