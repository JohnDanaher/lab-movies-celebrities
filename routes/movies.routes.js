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

    
        // app.post('/animals/create', async (req, res) => {
        //     console.log(req.body);
        //     const { name, animalType, age, userId } = req.body;
            
        //     const owner = await User.findOne({_id: userId}); // using await because it might take a while to search through the database and we need that value before the next process can be executed properly
        
        //     try { // this makes sure everything runs properly before. The catch will execute if it doesn't
        //     await Pet.create({ name, animalType, age: Number(age), ownersId: userId }) // same here
        //         .then(newPet => {
        //             owner.petsId.push(newPet._id) // pushes into the array you created in the User model
        //             owner.save();    
        //         })
        //         res.redirect('/')
        //     }
        //     catch(err){
        //         console.log(err)}
        //     // .then(() => res.redirect('/'))
        //     // .catch(error => console.log(error))
        //   })

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

module.exports = router;