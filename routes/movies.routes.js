// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Movie = require('../models/Movie.model');
const Celebrity = require('../models/Celebrity.model')

// all your routes here

router.get('/movies/create', (req, res) => {
    Celebrity.find()
    .then((celebs) => {
        console.log(celebs);
        res.render('movies/new-movie', {celebs})
    })
    .catch(error => console.log(error))
});

router.post('/movies/create', async (req, res) => {
    console.log('req body', req.body)
    const { title, genre, plot, celebrities } = req.body; 
    const movieCast = await Celebrity.find({_id: celebrities});
    try{
        await Movie.create({ title, genre, plot, cast: celebrities })
        .then((newCastMember) => {
            movieCast.cast.push(newCastMember._id)
            newCastMember.save();
        })
        res.redirect('/movies')
    }
    catch(error){
            console.log(error);
            res.redirect('/movies');
        }})


router.get('/movies', (req, res) => {
    Movie.find()
    .then( movies =>{
        res.render('movies/movies', { movies })
    })
    .catch(error => console.log(error))
})

router.get('/movies/:id', (req, res) => {
    const { id } = req.params;
    Movie.findById(id)
    .populate('cast')
    .then( foundMovie => {
        console.log('movie', foundMovie)
        res.render('movies/movie-details', foundMovie)
    })
    .catch(error => console.log(error))
})

router.post('/movies/:id/delete', (req, res) => {
    const { id } = req.params;
    Movie.findByIdAndRemove(id)
    .then(() => {
        res.redirect('/movies');
    })
    .catch(err => console.log(err))
})

router.get('/movies/:id/edit', (req, res) => {
    const { id } = req.params;
    Movie.findById(id)
    .then((movie) => {
        // we want to return a pre filled form with all the data of the movie the the user has chosen,
        // we also want the user to choose from all the Celebrities in our DB
        // before rendering the form we can call the methods to get all the celebrities 
        // and then pass both data (movie details and list of celebrieties) to our form page
        // see --> edit-movie.hbs 
        res.render('movies/edit-movie', movie)
    })
    .catch(err => console.log(err))
})

router.post('/movies/:id/edit', (req, res) => {
    const { id } = req.params;
    const { title, genre, plot, celebrities } = req.body;

    Movie.findByIdAndUpdate(id, { title, genre, plot, cast: celebrities})
    .then(() => res.redirect('/movies/movie-details'))
    .catch(error => console.log(error))
})
module.exports = router;