const express = require('express');

const server = express();

server.use(express.json());

function logRequests(req, res, next) {

  console.count("Número de requisições");

  return next();
}

server.use(logRequests);

function checkProjectExists(req, res, next){
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  if (!project) {
    return res.status(400).json({error: 'Project does not exists'});
  }
  return next();
}

function validProjectWithThisId(req, res, next){
  const { id } = req.body;
  const project = projects.find(p => p.id == id);
  if (project) {
    return res.status(302).json({error: 'there is already a project with this id'});
  }
  return next();
}

function checkIdWasWritten(req, res, next){
  if (!(req.body.id || req.params.id)){
    return res.status(400).json({error: 'ID is required'});
  }

  return next();
}

function checkTitleWasWritten(req, res, next){
  if (!req.body.title){
    return res.status(400).json({error: 'TITLE is required'});
  }

  return next();
}

const projects = [];

server.use((req, res, next) => {
  console.time('Request')
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.log('Finalizou');
  console.timeEnd('Request');
});

server.get('/projects', (req, res) => {
  return res.json(projects);
})


server.post('/projects', checkIdWasWritten, checkTitleWasWritten, validProjectWithThisId, (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.post('/projects/:id/tasks', checkIdWasWritten, checkTitleWasWritten, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.tasks = [title];
  
  return res.json(project);
});


server.put('/projects/:id', checkIdWasWritten, checkTitleWasWritten, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkIdWasWritten, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  projects.splice(project, 1);

  return res.send('DELETOU');
});

server.listen(3000);
