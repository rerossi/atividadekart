import React, { useState, useEffect } from 'react';
import { Container, Form, Button, ListGroup, Modal } from 'react-bootstrap';

function CrudKart() {
    const [pilotos, setPilotos] = useState([]);
  const [editarID, setEditarID] = useState('');
  const [nome, setNome] = useState('');
  const [numero, setNumero] = useState(0);
  const [posicao, setPosicao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/listar/')
      .then((response) => response.json())
      .then((data) => {
        setPilotos(data.message);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (editarID) {
      // Atualizar dados do piloto
      fetch(`http://localhost:3000/editar/${editarID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.get('nome'),
          numero: parseInt(formData.get('numero')),
          posicao: formData.get('posicao'),
          categoria: formData.get('categoria'),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
          // Limpar campos de edição
          setEditarID('');
          setNome('');
          setNumero(0);
          setPosicao('');
          setCategoria('');

          // Atualizar a lista de pilotos após a edição
          fetch('http://localhost:3000/listar/')
            .then((response) => response.json())
            .then((data) => {
              setPilotos(data.message);
            });
        });
    } else {
      // Criar novo piloto
      fetch('http://localhost:3000/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.get('nome'),
          numero: parseInt(formData.get('numero')),
          posicao: formData.get('posicao'),
          categoria: formData.get('categoria'),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
          // Atualizar a lista de pilotos após criar um novo piloto
          fetch('http://localhost:3000/listar/')
            .then((response) => response.json())
            .then((data) => {
              setPilotos(data.message);
            });
        });
    }

    event.target.reset();
  };

  const handleEdit = (piloto) => {
    setEditarID(piloto._id);
    setNome(piloto.nome);
    setNumero(piloto.numero);
    setPosicao(piloto.posicao);
    setCategoria(piloto.categoria);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/excluir/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // Atualizar a lista de pilotos após excluir um piloto
        fetch('http://localhost:3000/listar/')
          .then((response) => response.json())
          .then((data) => {
            setPilotos(data.message);
          });
      });
  };

  return (
    <Container className="mt-4">
      <h1>Meu Front-End</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formNome">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" name="nome" value={nome} required onChange={(e) => setNome(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formNumero">
          <Form.Label>Número</Form.Label>
          <Form.Control type="number" name="numero" value={numero} required onChange={(e) => setNumero(parseInt(e.target.value))} />
        </Form.Group>

        <Form.Group controlId="formPosicao">
          <Form.Label>Posição</Form.Label>
          <Form.Control type="text" name="posicao" value={posicao} required onChange={(e) => setPosicao(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formCategoria">
          <Form.Label>Categoria</Form.Label>
          <Form.Control type="text" name="categoria" value={categoria} required onChange={(e) => setCategoria(e.target.value)} />
        </Form.Group>

        <Button variant="primary" type="submit">
          {editarID ? 'Atualizar Piloto' : 'Criar Piloto'}
        </Button>
      </Form>

      <ListGroup className="mt-4">
        {pilotos.map((piloto) => (
          <ListGroup.Item key={piloto._id}>
            <div>Nome: {piloto.nome}</div>
            <div>Número: {piloto.numero}</div>
            <div>Posição: {piloto.posicao}</div>
            <div>Categoria: {piloto.categoria}</div>
            <Button variant="secondary" className="mr-2" onClick={() => handleEdit(piloto)}>
              Editar
            </Button>
            <Button variant="danger" onClick={() => handleDelete(piloto._id)}>
              Excluir
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Piloto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNomeModal">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" name="nome" value={nome} required onChange={(e) => setNome(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formNumeroModal">
              <Form.Label>Número</Form.Label>
              <Form.Control type="number" name="numero" value={numero} required onChange={(e) => setNumero(parseInt(e.target.value))} />
            </Form.Group>

            <Form.Group controlId="formPosicaoModal">
              <Form.Label>Posição</Form.Label>
              <Form.Control type="text" name="posicao" value={posicao} required onChange={(e) => setPosicao(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formCategoriaModal">
              <Form.Label>Categoria</Form.Label>
              <Form.Control type="text" name="categoria" value={categoria} required onChange={(e) => setCategoria(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Atualizar Piloto
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
export default CrudKart;
