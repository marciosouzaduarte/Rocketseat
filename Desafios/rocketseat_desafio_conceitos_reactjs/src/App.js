import React, { useState, useEffect } from 'react';
import api from './services/api';

import './styles.css';

const App = () => {
  const [inputTitle, setInputTitle] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [inputTechs, setInputTechs] = useState('');
  const [repositories, setRepositories] = useState([]);

  const initialCall = async () => {
    const repos = await api.get('/repositories');
    setRepositories(repos.data);
  };

  useEffect(() => {
    initialCall();
  }, []);

  const handleAddRepository = async () => {
    if (inputTitle === '' || inputUrl === '' || inputTechs === '') {
      alert('Todos os campos devem ser preenchidos');
      return;
    }

    const newRepositoryInfo = {
      title: inputTitle,
      url: inputUrl,
      techs: inputTechs.split(','),
    };

    const newRepository = await api.post('/repositories', newRepositoryInfo);

    if (newRepository.status === 200 || newRepository.status === 201) {
      setInputTitle('');
      setInputUrl('');
      setInputTechs('');
      setRepositories([...repositories, newRepository.data]);
    }
  };

  const handleRemoveRepository = async (id) => {
    const deletedRepository = await api.delete(`/repositories/${id}`);

    if (deletedRepository.status === 200 || deletedRepository.status === 204) {
      const repos = repositories.filter((repo) => repo.id !== id);
      setRepositories(repos);
    }
  };

  const handleChangeInput = (event) => {
    const { id, value } = event.target;

    if (id === 'title') {
      setInputTitle(value);
    }

    if (id === 'url') {
      setInputUrl(value);
    }

    if (id === 'techs') {
      setInputTechs(value);
    }
  };

  return (
    <div id="div-listagem">
      <form>
        <label htmlFor="title">
          Title:
          <input onChange={handleChangeInput} value={inputTitle} id="title" />
        </label>
        <label htmlFor="url">
          URL:
          <input onChange={handleChangeInput} value={inputUrl} id="url" />
        </label>
        <label htmlFor="techs">
          Techs:
          <input onChange={handleChangeInput} value={inputTechs} id="techs" />
        </label>
      </form>

      <button type="button" id="button-adicionar" onClick={handleAddRepository}>
        Adicionar
      </button>

      <ul data-testid="repository-list">
        {repositories.map((repo) => (
          <li key={repo.id}>
            {repo.title}
            <button type="button" onClick={() => handleRemoveRepository(repo.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
