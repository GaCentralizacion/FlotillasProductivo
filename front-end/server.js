const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(__dirname + 'dist/front-end'))
