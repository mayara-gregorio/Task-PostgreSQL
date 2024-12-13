const express = require("express");
const app = express();
const pool = require("./db.js")

const PORT = process.env.PORT || 3000;
app.use(express.json())

//IMPORTANTE DECLARAR FUNÇÕES ASSÍCRONAS
//IMPORTANTE USAR TRY/CATCH PARA TRATAMENTOS DE ERROS

// app.get("/users", (req, res) => {
//     res.send(users);
// })

app.get("/users", async (req, res) => {
    try{
        const users = await pool.query("SELECT * FROM USERS ORDER BY ID_USER ASC");
        //rows retorna as linhas da tabela
        res.status(200).json(users.rows);
        console.log(users.rows.length)
    }catch(error){
        console.log(error);
        res.status(500).send("Não foi possível completar a busca");
    }
})

app.get("/tasks", async (req, res) => {
    try{
        const tasks = await pool.query("SELECT * FROM TASKS ORDER BY ID_TASK ASC");
        res.status(200).send(tasks.rows);
        console.log(tasks.rows.length);

    }catch(error){
        console.log(error);
        res.send("Não foi possível completar a busca")
    }
})

app.get("/users/:id/tasks", async (req, res) => {
    const id = req.params.id
    console.log(id)
    try{
        const tasks = await pool.query("SELECT * FROM TASKS WHERE ID_USER =  $1 ORDER BY ID_TASK ASC ", [id]);
        res.status(200).send(tasks.rows);
        console.log(tasks.rows.length);

    }catch(error){
        console.log(error);
        res.send("Não foi possível completar a busca")
    }
})

app.post("/tasks", async (req, res) => {
    const {title, description, id_user} = req.body
    try{
        //RETURNING É PARA RETORNAR AS LINHAS
        const task = await pool.query("INSERT INTO TASKS (TITLE_TASK, DESCRIPTION, ID_USER) VALUES ($1, $2, $3) RETURNING *", [title, description, id_user]);
        res.status(201).json(task.rows[0])

    }catch(error){
        console.log(error);
        res.status(500).send("Não foi possível criar a tarefa");
    }
})


// app.get("/users/:id",  (req, res) => {
//     const user = users.find((user) => user.id == req.params.id);
//     res.send(user);
// })

app.get("/users/:id", async (req, res) => {
    const {id} = req.params;
    try{
        const user = await pool.query("SELECT * FROM USERS WHERE ID_USER = $1", [id]);
        if(user.rows.length === 0){
            res.send("Usuário não encontrado");
        }else{
            res.send(user.rows[0])
        }
    }catch(error){
        console.log(error)
        res.status(500).send("Não foi possível completar a requisição")
    }
})

// app.post("/users", (req, res) => {
//     const data = {
//         id: uuidv4(),
//         name: req.body.name,
//         email: req.body.email,
//     }
//     users.push(data)
//     res.send(data);
// })

app.post("/users", async (req, res) => {
    const {name, email, password} = req.body
    try{
        //RETURNING É PARA RETORNAR AS LINHAS
        const user = await pool.query("INSERT INTO USERS (NAME_USER, EMAIL_USER, PASSWORD_USER) VALUES ($1, $2, $3) RETURNING *", [name, email, password]);
        res.status(201).json(user.rows[0])

    }catch(error){
        console.log(error);
        res.status(500).send("Não foi possível criar o usuário");
    }
})

// app.put("/users/:id", (req, res) => {
//     const index = users.findIndex((user) => user.id === req.params.id);
//     users[index] = {
//         id: users[index].id,
//         name: req.body.name === undefined ? users[index].name : req.body.name,
//         email: req.body.email === undefined ? users[index].email : req.body.email,
//     }
//     res.send(users[index])
// })

app.put("/users/:id", async (req, res) => {
    const {id} = req.params;
    const {name, email, password} = req.body;
    try{
        const user = await pool.query("UPDATE USERS SET NAME_USER = $1, EMAIL_USER = $2, PASSWORD_USER = $3 WHERE ID_USER = $4 RETURNING *", [name, email, password, id]);
        if(user.rows.length === 0){
            res.send("Usuário não encontrado");
        }else{
            res.status(200).send(user.rows[0]);
        }
    }catch(error){
        console.log(error);
        res.status(500).send("Não foi possível atualizar o usuário");
    }
})

// app.delete("/users/:id", (req, res) => {
//     const index = users.findIndex((user) => user.id === req.params.id);
//     users.splice(index, 1)
//     res.send("User deleted")
// })

app.delete("/users/:id", async (req, res) => {
    const {id} = req.params;
    try{
        const user = await pool.query("DELETE FROM USERS WHERE ID_USER = $1 RETURNING *", [id]);
        if(user.rows.length === 0){
            res.send("Usuário não encontrado");
        }else{
            res.status(200).send(user.rows[0]);
        }
    }catch(error){
        console.log(error);
        res.send(500).send("Não foi possível excluir o usuário");
    }
})

app.listen(PORT, ()=>{
    console.log(`Server running in port ${PORT}`);
})