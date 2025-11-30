import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));


const conn = mysql.createPool({
    host: "erxv1bzckceve5lh.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "o5598smck8ehjf4t",
    password: "mvh6vfcn4cr7lh2l",
    database: "s9gw6kwln9hy2m31",
    connectionLimit: 10,
    waitForConnections: true
});


app.get('/', async (req, res) => {

  
  let sqlAuthors = `
    SELECT authorId, firstName, lastName
    FROM q_authors
    ORDER BY lastName;
  `;
  let [authors] = await conn.query(sqlAuthors);


  let sqlCategories = `
    SELECT DISTINCT category
    FROM q_quotes
    ORDER BY category;
  `;
  let [categories] = await conn.query(sqlCategories);

  res.render("index", { 
      authors: authors,
      categories: categories
  });
});


app.get('/searchByKeyword', async (req, res) => {
  let userKeyword = req.query.keyword;

  let sql = `
    SELECT quote, authorId, firstName, lastName
    FROM q_quotes
    NATURAL JOIN q_authors
    WHERE quote LIKE ?;
  `;
  let [rows] = await conn.query(sql, [`%${userKeyword}%`]);

  res.render("results", { quotes: rows });
});


app.get('/searchByAuthor', async (req, res) => {
  let userAuthorId = req.query.authorId;

  let sql = `
    SELECT authorId, firstName, lastName, quote
    FROM q_quotes
    NATURAL JOIN q_authors
    WHERE authorId = ?;
  `;
  let [rows] = await conn.query(sql, [userAuthorId]);

  res.render("results", { quotes: rows });
});

app.get('/api/author/:id', async (req, res) => {
  let authorId = req.params.id;

  let sql = `
    SELECT *
    FROM q_authors
    WHERE authorId = ?
  `;
  let [rows] = await conn.query(sql, [authorId]);
  res.send(rows);
});


app.get('/searchByCategory', async (req, res) => {
  let category = req.query.category;

  let sql = `
    SELECT quote, firstName, lastName, authorId
    FROM q_quotes
    NATURAL JOIN q_authors
    WHERE category = ?;
  `;
  let [rows] = await conn.query(sql, [category]);

  res.render("results", { quotes: rows });
});


app.get('/searchByLikes', async (req, res) => {
  let minLikes = req.query.minLikes;
  let maxLikes = req.query.maxLikes;

  let sql = `
    SELECT quote, firstName, lastName, authorId, likes
    FROM q_quotes
    NATURAL JOIN q_authors
    WHERE likes BETWEEN ? AND ?;
  `;
  let [rows] = await conn.query(sql, [minLikes, maxLikes]);

  res.render("results", { quotes: rows });
});


app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await conn.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error");
    }
});

app.listen(3000, ()=>{
    console.log("Express server running")
});
