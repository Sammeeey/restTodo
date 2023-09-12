const exp = require('constants')
const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const { v4: uuidv4 } = require('uuid');

const port = 3000
let db = [
    {
        id: uuidv4(),
        todo: "groceries",
        details: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit, quisquam?",
        done: false
    },
    {
        id: uuidv4(),
        todo: "cooking",
        details: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
        done: true
    },
    {
        id: uuidv4(),
        todo: "laudry",
        details: "Lorem ipsum, amet consectetur adipisicing elit.",
        done: true
    }
]

app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')


app.listen(port, () => {
    console.log(`listening to port ${port}`)
})

app.get('/', (req, res) => {
    console.log('GET get /')
    // res.send('GET get /')
    res.render('home')
})

app.get('/todos', (req, res) => {
    console.log('GET /todos')
    // res.send('GET /todos')
    
    res.render('todos/todos', {db})
})

app.get('/todos/new', (req, res) => {
    console.log('GET /todos/new')
    // res.send('GET /todos/new')
    console.log(req.params)
    console.log(req.body)

    res.render('todos/todoNew')
})

app.post('/todos', (req, res) => {
    console.log('POST /todos/:id')
    // res.send('POST /todos/:id')
    // console.log(req.params)
    console.log(req.body)

    const newPostId = uuidv4()
    const {todo,details,done} = req.body
    const todoStatus = done === 'on' ? true : false

    const newTodo = {id:newPostId, todo, details, done:todoStatus}
    console.log(newTodo)
    db.push(newTodo)

    res.redirect(`/todos/${newPostId}`)
})

app.get('/todos/:id', (req, res) => {
    console.log('GET /todos/:id')
    // res.send('GET /todos/:id')
    const { id:todoId } = req.params
    // console.log(todoId)

    const todoEntry = db.find(entry => entry.id == todoId)
    // console.log(todoEntry)

    res.render('todos/todo', {todoEntry})
})

app.get('/todos/:id/edit', (req, res) => {
    console.log('GET /todos/:id/edit')
    // res.send('GET /todos/:id/edit')
    const { id:todoId } = req.params
    // console.log(todoId)

    const todoEntry = db.find(entry => entry.id == todoId)
    // console.log(todoEntry)

    res.render('todos/todoEdit', {todoEntry})
})

app.patch('/todos/:id', (req, res) => {
    console.log('PATCH /todos/:id')
    // res.send('PATCH /todos/:id')
    const { id:todoId } = req.params
    // console.log(req.params)
    const { todo:updatedTodo, details, done } = req.body

    const todoEntry = db.find(entry => entry.id == todoId)
    console.log(todoEntry)
    todoEntry.todo = updatedTodo
    todoEntry.details = details
    todoEntry.done = done === 'on' ? true : false

    res.redirect(`/todos/${todoId}`)
})

app.delete('/todos/:id', (req, res) => {
    console.log('DELETE /todos/:id')
    // res.send('DELETE /todos/:id')
    // console.log(req.params)
    // console.log(req.body)

    const { id:todoId } = req.params
    const deleteIndex = db.findIndex(entry => entry.id === todoId)
    db.splice(deleteIndex, 1)    // TODO fix deletion!
    // console.log(`db after deleting ${todoId}:\n`, db)
    res.redirect('/todos')
})


// async function readJson() {
//     try {
//       // Read the JSON file
//       const data = await fs.readFile(jsonFilePath, 'utf8');
//       let jsonData = JSON.parse(data);

//       return jsonData

//     } catch (error) {
//       console.error('Error:', error);
//       process.exit(1);
//     }
// }

// async function writeJson(inp) {
//     // TODO make functional
//     fs.writeFile(outputFileName, JSON.stringify(inputFileObject), (error) => {
//         if (error) {
//         console.log(error);
//         }
//         console.log(`${outputFileName} written`)
//     })
// }
