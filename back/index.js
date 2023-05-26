const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

const uri = 'mongodb+srv://rerossi1985:Minhasenha@aulanode.ktdwa9e.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

const db = client.db('KWF');

app.get('/listar/', (req, res) => {
  async function selectKarts() {
    const pilotos = await db.collection('pilotos').find().toArray();
    res.json({ message: pilotos });
  }
  selectKarts();
});

app.post('/criar', (req, res) => {
  async function insereNovoKart() {
    const pilotos = db.collection('pilotos');
    const dadosPiloto = {
      nome: req.body.nome,
      numero: parseInt(req.body.numero),
      posicao: req.body.posicao,
      categoria: req.body.categoria,
    };
    const result = await pilotos.insertOne(dadosPiloto);
    res.json({ message: `O ID do piloto inserido foi ${result.insertedId}` });
  }
  insereNovoKart();
});

app.put('/editar/:id', async (req, res) => {
  const editarKart = async (id, body) => {
    const pilotos = db.collection('pilotos');
    const filtro = { _id: new ObjectId(id) };
    const update = { $set: body };
    await pilotos.updateOne(filtro, update);
    res.json({ message: 'O piloto foi atualizado' });
  };
  editarKart(req.params.id, req.body);
});

app.delete('/excluir/:id', async (req, res) => {
  const excluirKart = async (id) => {
    const pilotos = db.collection('pilotos');
    const filtro = { _id: new ObjectId(id) };
    await pilotos.deleteOne(filtro);
    res.json({ message: 'O piloto foi excluído' });
  };
  excluirKart(req.params.id);
});

client.connect()
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });
