const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  repositories.length > 0
    ? response.json(repositories)
    : response.json({ message: "Não existem repositórios cadastrados" });
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();
  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const likes = repositories[repositoryIndex].likes;
  const repository = {
    id,
    title: title ? title : repositories[repositoryIndex].title,
    url: url ? url : repositories[repositoryIndex].url,
    techs: techs ? techs : repositories[repositoryIndex].techs,
    likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories[repositoryIndex].likes += 1;

  return response.json({ message: "Like added" });
});

module.exports = app;
