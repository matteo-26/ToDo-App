import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import fs from "fs";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));


var navbar = [];
var activity = [];
var receivedValue = "";
var title = "";

const db = new pg.Client({
    host: "localhost",
    password: config.password,
    user: "postgres",
    port: 5432,
    database: "todoapp"
});

db.connect();




async function getData(){
    const result = await db.query("SELECT * FROM categories JOIN activity ON categories.id = activity.categories_id");
    const navbar_result = await db.query("SELECT * FROM categories");
    const result_id = await db.query("SELECT id FROM categories WHERE name = $1", [receivedValue]);

    
    const navbar_rows = navbar_result.rows;
    const data_rows = result.rows;
    
    activity = [];
    
    for (let i = 0; i<navbar_rows.length; i++){
        if(navbar.includes(navbar_rows[i].name) === false){
            navbar.push(navbar_rows[i].name);
        }
    }
    if(result_id.rows.length > 0){
        const receivedId = result_id.rows[0].id;
        for(let i=0;i<data_rows.length;i++){
            if(data_rows[i].categories_id == receivedId){
                activity.push(data_rows[i].activity_name);
            }
        }
    }
    

    
    
}

//creazione nuova categoria
async function newCategory(newCat){
    
    await db.query("INSERT INTO categories (name) VALUES ($1)", [newCat]);

}

//valore categoria
app.post("/sendValue", (req, res) => {
    receivedValue = req.body.value;
    
    getData();
});
//route principale
app.get("/", async (req, res) => {
    
    await getData();
    res.render("index.ejs", {
        navbar: navbar,
        activity: activity,
        title: receivedValue
    });
});







//nuova categoria
app.post("/new", (req, res) => {
    var newCat = req.body.new_act;
    newCategory(newCat);
    res.redirect("/");
});

//nuova attività
app.post("/new-act", async (req, res) => {
    var newAct = req.body.new_act;
    
    var receivedId = await db.query("SELECT id FROM categories WHERE name = $1", [receivedValue]);
    var final_id = receivedId.rows[0].id;

    await db.query("INSERT INTO activity (activity_name, categories_id) VALUES ($1, $2)", [newAct, final_id]);
    res.redirect("/");
});




//eliminazione attività
app.post("/delete", async (req, res) => {
    var receivedId = req.body.passId;
    var delAct = activity[receivedId];
    
    await db.query("DELETE FROM activity WHERE activity_name = $1", [delAct]);
   res.redirect("/");
});

//eliminazione categoria
app.post("/del", async (req, res) => {
    var delCat = req.body.new_act;

    var result = await db.query("SELECT id FROM categories WHERE name = $1", [delCat]);

    var delId = result.rows[0].id;
    
    //eliminazione
    await db.query("DELETE FROM activity WHERE categories_id = $1", [delId]);
    await db.query("DELETE FROM categories WHERE name = $1", [delCat]);
    
    receivedValue = "";
    res.redirect("/");
})




//avvio server
app.listen(port, () => {
    console.log("Server running on port " + port);
})
