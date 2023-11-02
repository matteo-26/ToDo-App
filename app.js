import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var navbar = [];
var activity = [];
var receivedValue = 1;

const db = new pg.Client({
    host: "localhost",
    password: "",
    user: "postgres",
    port: 5432,
    database: "todoapp"
});

db.connect();


async function getData(){
    const result = await db.query("SELECT * FROM categories JOIN activity ON categories.id = activity.categories_id");
    const data_rows = result.rows;
    activity = [];

    for (let i = 0; i<data_rows.length; i++){
        if(navbar.includes(data_rows[i].name) === false){
            navbar.push(data_rows[i].name);
        }

        if(data_rows[i].categories_id == receivedValue){
            activity.push(data_rows[i].activity_name);
        }
    }
    
}

app.get("/", (req, res) => {
    getData();
    res.render("index.ejs", {
        navbar: navbar,
        activity: activity
    });
})

app.post("/sendValue", (req, res) => {
    receivedValue = req.body.value;
    getData();
})

app.post("/new", (req, res) => {
    var newActivity = req.body.new_act;
    navbar.push(newActivity);
    res.redirect("/");
})

app.listen(port, () => {
    console.log("Server running on port " + port);
})
