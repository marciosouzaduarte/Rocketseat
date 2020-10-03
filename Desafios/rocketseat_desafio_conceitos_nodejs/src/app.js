const express = require('express');
const cors = require('cors');
const { v4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get('/repositories', (request, response) => {
    return response.status(200).send(repositories);
});

app.post('/repositories', (request, response) => {
    const { title, url, techs } = request.body;

    const repository = {
        id: v4(),
        title,
        url,
        techs,
        likes: 0,
    };

    repositories.push(repository);

    return response.status(201).send(repository);
});

app.put('/repositories/:id', (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

    if (repositoryIndex === -1) {
        return response.status(400).send({ message: 'Repository not found' });
    }

    repositories[repositoryIndex] = {
        ...repositories[repositoryIndex],
        title,
        url,
        techs,
    };

    return response.status(200).send(repositories[repositoryIndex]);
});

app.delete('/repositories/:id', (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

    if (repositoryIndex === -1) {
        return response.status(400).send({ message: 'Repository not found' });
    }

    repositories = repositories.filter((repo) => repo.id !== id);

    return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

    if (repositoryIndex === -1) {
        return response.status(400).send({ message: 'Repository not found' });
    }

    repositories[repositoryIndex] = {
        ...repositories[repositoryIndex],
        likes: ++repositories[repositoryIndex].likes,
    };

    return response.status(200).send(repositories[repositoryIndex]);
});

module.exports = app;
