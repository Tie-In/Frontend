const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use('/static', express.static(path.join(__dirname, '/build/static')));
app.use('/api', proxy({ target: 'https://tieinservice.herokuapp.com/', changeOrigin: true }));
app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
})
