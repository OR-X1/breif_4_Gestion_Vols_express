const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const {connection} = require('./connexion');
const { isBuffer } = require('util');
const app = express();

const port = 3000

app.locals.data = {
  'nb_place' : ''
};



// var connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: 'safiair'
// });



// set view file
app.set('views',path.join(__dirname,'view'));
app.use(express.static(__dirname + '/public'));


// set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {

  let sql_avion = "SELECT * FROM avion";
  let sql_ville = "SELECT * FROM ville";
    let query = connection.query(sql_avion, (err, rows_avion) => {
        if(err) {
          throw err;
        }else{

          let row_flights = rows_avion;

          let query = connection.query(sql_ville, (err, rows_ville) => {
            if(err) {
              throw err;
            }else{
              
            }
    
            res.render('index',{
                title: 'Safi Air',
                flights : row_flights,
                villes : rows_ville
            });
          });
        }
    });
})


// search

// app.post('/', (req, res) => {

//   let id_ville = req.body.id_ville;
//   let date_depart = req.body.date_depart;
//   let h_depart = req.body.h_depart;
//   let nb_place = req.body.nb_place;

//   let sql = `SELECT * FROM avion where id_ville = 1`;

//   // ${id_ville} and date_depart = ${date_depart} and h_depart like ${h_depart}
//     let query = connection.query(sql, (err, rows) => {
//         if(err) throw err;

//         res.render('index',{
//             title: 'CRUD /database',
//             flights : rows
//         });
//     });
// })


app.post('/', (req, res) => {

  let id_ville = req.body.id_ville;
  let date_depart = req.body.date_depart;
  let h_depart = req.body.h_depart;
  let nb_place = req.body.nb_place;

  app.locals.data.nb_place = nb_place;

  let sql_avion = `SELECT * FROM avion where id_ville = ${id_ville} and date_depart = "${date_depart}" and h_depart like "${h_depart}" and capacity + ${nb_place} <= 20`;
  // and date_depart = ${date_depart} and h_depart like ${h_depart}
  let sql_ville = "SELECT * FROM ville";
    let query = connection.query(sql_avion, (err, rows_avion) => {
        if(err) {
          throw err;
        }else{

          let row_flights = rows_avion;

          let query = connection.query(sql_ville, (err, rows_ville) => {
            if(err) {
              throw err;
            }else{
              
            }
    
            res.render('index',{
                title: 'Safi Air',
                flights : row_flights,
                villes : rows_ville
            });
          });
        }
    });
})

// client_reserv

app.post('/client_reserv', (req, res) => {

  let nom = req.body.nom;
  let prenom = req.body.prenom;
  let email = req.body.email;
  let tele = req.body.tele;


  let sql_avion = `INSERT INTO client (nom, prenom, email, tele) VALUES ('${nom}', '${prenom}', '${email}', '${tele}');`;
  // and date_depart = ${date_depart} and h_depart like ${h_depart}
  // let sql_ville = "SELECT * FROM ville";
    // let query = connection.query(sql_avion, (err, rows_avion) => {
    //     if(err) {
    //       throw err;
    //     }else{

          let row_flights = rows_avion;

          let query = connection.query(sql_ville, (err, rows_ville) => {
            if(err) {
              throw err;
            }else{
              
            }
    
            res.render('index',{
                title: 'Safi Air',
                flights : row_flights,
                villes : rows_ville
            });
          });
    //     }
    // });
})


app.get('/', (req, res) => {

  let sql_avion = "SELECT * FROM avion";
  let sql_ville = "SELECT * FROM ville";
    let query = connection.query(sql_avion, (err, rows_avion) => {
        if(err) {
          throw err;
        }else{

          let row_flights = rows_avion;

          let query = connection.query(sql_ville, (err, rows_ville) => {
            if(err) {
              throw err;
            }else{
              
            }
    
            res.render('index',{
                title: 'Safi Air',
                flights : row_flights,
                villes : rows_ville
            });
          });
        }
    });
})




//------------------------------------------------- dashboard -------------------------------------------------
//------------------------------------------------- dashboard -------------------------------------------------
app.get('/dashboard', (req, res) => {
      res.render('dashboard',{
          title: 'CRUD /database'
      })
})


app.get('/client', (req, res) => {

  let sql = "SELECT * FROM client";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;

        res.render('client',{
            title: 'CRUD /database',
            clients : rows
        });
    });
})

app.get('/flight', (req, res) => {

  let sql = "SELECT * FROM avion";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;

        res.render('flight',{
            title: 'CRUD /database',
            flights : rows
        });
    });
})

app.get('/extras', (req, res) => {

  let sql = "SELECT * FROM extras";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;

        res.render('extras',{
            title: 'CRUD /database',
            extras : rows
        });
    });
})

app.get('/ville', (req, res) => {

  let sql = "SELECT * FROM ville";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;

        res.render('ville',{
            title: 'CRUD /database',
            villes : rows
        });
    });
})


// Server Listening
app.listen(port, () => {
    console.log('Server is running at port '+port);
});
 