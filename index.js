const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let counter = 0;

server.use((req, res, next) => {
  counter++;
  console.log(`Requisitions Total : ${counter}`);
  next();
});

function projectExists(req, res, next) {
  const id = req.body.id ? req.body.id : req.params.id;
  const index = projects.findIndex(obj => obj.id == id);

  req.index = index;

  if (index != -1) {
    return next();
  } else {
    return res.status(400).json({ message: "Invalid project number" });
  }
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const index = projects.findIndex(obj => obj.id == id);
  if (projects[index]) {
    return res.status(400).json({ message: "Project already exists!!!" });
  }
  const project = {
    id: id,
    title: title,
    tasks: []
  };

  projects.push(project);

  return res.status(200).json({ message: `Project number ${id} Created!` });
});

server.get("/projects", (req, res) => {
  return res.status(200).json(projects);
});

server.put("/projects/:id", projectExists, (req, res) => {
  const { id } = req.params;
  projects[req.index].title = req.body.title;
  return res.status(200).json({ message: `Project ${id} has updated` });
});

server.delete("/projects/:id", projectExists, (req, res) => {
  const { id } = req.params;
  projects.splice(req.index, 1);
  return res.status(200).json({ message: `Project ${id} has deleted` });
});

server.post("/projects/:id/tasks", projectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  projects[req.index].tasks.push(title);
  return res
    .status(200)
    .json({ message: `Task created, In project number ${id}` });
});
server.listen(3000);
