import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

//EJS template
app.get('/work', (req, res) => {
    let tasks = JSON.parse(fs.readFileSync('workData.json'));
    if (!Array.isArray(tasks)) {
        tasks = [];
    }
    res.render('work', { tasks });
});


// Read from JSON file
app.get('/tasks', (req, res) => {
    const tasks = JSON.parse(fs.readFileSync('workData.json'));
    res.json(tasks);
});


// Add new task to the JSON file
app.post('/addTask', (req, res) => {
    const newTask = req.body.task;
    let tasks = JSON.parse(fs.readFileSync('workData.json'));
    if (!Array.isArray(tasks)) {
        tasks = [];
    }
    tasks.push(newTask);
    fs.writeFileSync('workData.json', JSON.stringify(tasks, null, 2));
    res.redirect('/work');
});


// Edit task
app.post('/editTask', (req, res) => {
    const index = req.body.index;
    const updatedTask = req.body.updatedTask;
    console.log('Received edit request. Index:', index, 'Updated task:', updatedTask);
    let tasks = JSON.parse(fs.readFileSync('workData.json'));
        if (Array.isArray(tasks) && tasks[index] !== undefined) {
            tasks[index] = updatedTask;
            
            fs.promises.writeFile('workData.json', JSON.stringify(tasks, null, 2))
    .then(() => {
        res.sendStatus(200);
    })
    .catch(error => {
        console.error('Error saving the updated data:', error);
        res.sendStatus(500);
    });
        } else {
            res.sendStatus(400);
        }

    try {
        fs.writeFileSync('workData.json', JSON.stringify(tasks, null, 2));
        res.sendStatus(200);
    } catch (error) {
        console.error('Error saving the updated data:', error);
        res.sendStatus(500);
    }
});

// Delete task
app.post('/deleteTask', (req, res) => {
    const index = req.body.index;
    let tasks = JSON.parse(fs.readFileSync('workData.json'));
    if (Array.isArray(tasks) && tasks[index] !== undefined) {
        tasks.splice(index, 1);
        fs.writeFileSync('workData.json', JSON.stringify(tasks, null, 2));
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});