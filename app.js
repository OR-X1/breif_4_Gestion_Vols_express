const path = require('path');
const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const bodyParser = require('body-parser');
const {connection} = require('./connexion');
const { isBuffer } = require('util');

var nodemailer = require('nodemailer');
const app = express();

const port = 3000

app.locals.data = {
  'nb_place' : ''
};


// email -------------------------
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contact.quizzy.com@gmail.com',
    pass: 'quizzy.contact.2021'
  }
});


// end email -------------------------






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
                flights : "",
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
  let sql_extras = "SELECT * FROM extras";
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

                  let row_villes = rows_ville;

                  let query = connection.query(sql_extras, (err, rows_extras) => {
                    if(err) {
                      throw err;
                    }else{
                      
                    }
                    console.log(row_flights)
            
                    res.render('index',{
                        title: 'Safi Air',
                        flights : row_flights,
                        villes : row_villes,
                        extras : rows_extras
                    });
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
  let avion_id = req.body.avion_id;
  let capacity = req.body.capacity;

  // let sql_ticket = "SELECT reservation.*, avion.*, ville.* FROM reservation, avion, ville where  reservation.id_avion = avion.id and reservation.id_ville = ville.id";
  let sql_ticket = "SELECT avion.*, ville.* FROM avion, ville where avion.id_ville = ville.id and avion.id = " + avion_id;

    let query_ticket = connection.query(sql_ticket, (err, rows) => {
        if(err) {
          throw err;
        }else{

          var  test =  ejs.render(fs.readFileSync(__dirname+'/view/ticket.ejs','utf8'),{data:rows});
          console.log(test);

              var mailOptions = {
                from: 'contact.quizzy.com@gmail.com',
                to: 'oghazlani0@gmail.com',
                subject: 'You got the ticket ',
                // text: ` Fulle name : ${nom} ${prenom}
                //         Vole id : ${avion_id}
                // `,
                html: test 
              };

              transporter.sendMail(mailOptions, (err, data) => {
                if (err) {
                    return log('Error occurs');
                }
              });
        }    
    });

  let sql_avion = `INSERT INTO client (nom, prenom, email, tele) VALUES ('${nom}', '${prenom}', '${email}', '${tele}');`;

  let update_capacity_avion = `UPDATE avion SET capacity = ${capacity} + ${app.locals.data.nb_place}  WHERE avion.id = ${avion_id}`;

    let query_avion = connection.query(sql_avion, (err, rows_avion) => {
        if(err) {
          throw err;
        }else{
        }
      // res.redirect('/');

    });

    let last_client = "SELECT id FROM client ORDER BY ID DESC LIMIT 1";

    // insert avion ----------------------------
    let query_client = connection.query(last_client, (err, rows_last_client) => {
      if(err) {
        throw err;
      }else{

        let last_client_id = rows_last_client[0].id;
        // console.log(rows_last_client[0].id);

        let last_client = `INSERT INTO reservation (nb_place, id_client, id_avion, id_extras) VALUES (${app.locals.data.nb_place}, ${last_client_id}, ${avion_id}, 1)`;

        // insert reservation ----------------------------
        let query_client = connection.query(last_client, (err, rows_ville) => {
          if(err) {
            throw err;
          }
          // res.redirect('/');
          // console.log(rows_ville);
        });
        // end insert reservation -----------------------------

      }

    });
    // end insert avion -----------------------------

    // insert avion ----------------------------
    let query_update_capacity_avion = connection.query(update_capacity_avion, (err, rows_ville) => {
      if(err) {
        throw err;
      }
      res.redirect('/');
    });
    // end insert avion -----------------------------

    
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

app.post('/update_extras', (req, res) => {
  let sql = `UPDATE extras SET choix = '${req.body.choix}', prix = '${req.body.prix}' WHERE extras.id = ${req.body.id}`;
  let query = connection.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/extras')
  })
});

app.get('/delete_extras/:id', (req, res) => {
  let sql = "DELETE FROM `extras` WHERE `extras`.`id` = " + req.params.id;
  let query = connection.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/extras')
  })
});

//----------------------------------------------------------- ville -----------------------------------------------------------

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

app.post('/update_ville', (req, res) => {
  let sql = `UPDATE ville SET name_ville = '${req.body.name_ville}' WHERE ville.id = ${req.body.id}`;
  let query = connection.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/ville')
  })
});

app.get('/delete_ville/:id', (req, res) => {
  let sql = "DELETE FROM `ville` WHERE `ville`.`id` = " + req.params.id;
  let query = connection.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/ville')
  })
});

//----------------------------------------------------------- end ville -----------------------------------------------------------


app.get('/reservation', (req, res) => {

  let sql = "SELECT reservation.*, client.*, avion.* FROM reservation, client, avion where reservation.id_client = client.id and reservation.id_avion = avion.id";

    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;

        res.render('reservation',{
            title: 'reservation',
            reservations : rows
        });
    });
})


// Server Listening
app.listen(port, () => {
    console.log('Server is running at port '+port);
});
 