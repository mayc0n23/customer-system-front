// importa o express
const express = require('express');
// inicia o express
const app = express();
// nome da pasta no dist que sera feito o build
const appName = 'customer-system-front';
// local onde o build gera os arquivos
const outputPath = `${__dirname}/dist/${appName}`;
// seta o diretorio de build para servir o conteudo do Angular
app.use(express.static(outputPath));
// redirecionar qualquer requisição para o index.html
app.get('/*', (req, res) => {
    res.sendFile(`${outputPath}/index.html`);
});
// ouvir a porta que o heroku disponibilizar
app.listen(process.env.PORT);