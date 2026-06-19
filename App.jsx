import { tecnologias } from './dados.js';
import { useState } from 'react';
import './App.css';

function App() {
  const [busca, setBusca] = useState('');
  // Novos campos de constante
  const [inputNome, setInputNome] = useState('');
  const [inputValor, setInputValor] = useState('');
  const [inputImagem, setInputImagem] = useState('');
  const [items, setItems] = useState(tecnologias);
  const [editandoId, setEditandoId] = useState(null);

  function iniciarEdicao(tecnologia) {
    setEditandoId(tecnologia.id);
    setInputNome(tecnologia.nome);
    setInputValor(tecnologia.valor);
    setInputImagem(tecnologia.imagem);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setInputNome('');
    setInputValor('');
    setInputImagem('');
  }

  function cadastrar() {
    if (!inputNome.trim()) return;

    const novoItem = {
      id: Date.now(),
      nome: inputNome.trim(),
      valor: Number(inputValor) || 0,
      imagem: inputImagem.trim(),
    };
    // Salva no array
    console.log(novoItem);
    setItems([...items, novoItem]);
    setInputNome('');
    setInputValor('');
    setInputImagem('');
  }

  const filtrados = items.filter((tecnologia) => {
    return tecnologia.nome.toLowerCase().includes(busca.toLowerCase());
  });

  // Função de apagar
  function apagar(id) {
    const novaLista = items.filter((tecnologia) => {
      return tecnologia.id !== id;
    });
    setItems(novaLista);
  }

  return (
    <div className="container">
      <h1>Tecnologias</h1>
      <input
        type="text"
        placeholder="Filtrar por nome..."
        value={busca}
        onChange={(event) => setBusca(event.target.value)}
      />

      <div className="form">
        <h2>Cadastrar Tecnologias</h2>

        <input
          type="text"
          placeholder="Nome da tecnologia"
          value={inputNome}
          onChange={(e) => setInputNome(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor R$"
          value={inputValor}
          onChange={(e) => setInputValor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Imagem"
          value={inputImagem}
          onChange={(e) => setInputImagem(e.target.value)}
        />

        {editandoId ? (
          <div className="form-botoes">
            <button className="btn-cancelar" onClick={cancelarEdicao}>
              Cancelar
            </button>
            <button className="btn-salvar" onClick={() => {}}>
              Editar
            </button>
          </div>
        ) : (
          <button onClick={cadastrar}>Cadastrar</button>
        )}
      </div>

      <ul className="lista">
        {filtrados.map((tecnologia) => (
          <li key={tecnologia.id} className="item">
            <img
              src={tecnologia.imagem}
              alt={tecnologia.nome}
              className="item-img"
            />
            <div className="item-info">
              <strong>{tecnologia.nome}</strong>
              <span>R$ {tecnologia.valor},00</span>
            </div>

            {/* Botão de apagar */}
            <div className="acoes">
              <button
                className="btn-apagar"
                onClick={() => {
                  apagar(tecnologia.id);
                }}
              >
                Apagar
              </button>
              {/* Botão de editar */}
              <button
                className="btn-editar"
                onClick={() => {
                  iniciarEdicao(tecnologia);
                }}
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
