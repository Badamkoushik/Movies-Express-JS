const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'moviesData.db')
let db = null
const initalizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running At http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error : ${e.message}`)
  }
}
initalizeDBAndServer()

//GET

app.get('/movies/', async (request, response) => {
  const movieQuery = `SELECT 
    movie_name as movieName
    FROM 
    movie;`
  const DBstatus = await db.all(movieQuery)
  response.send(DBstatus)
})

//POST

app.post('/movies/', async (request, response) => {
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const addMovieQuery = `
  INSERT INTO movie(director_id,movie_name,lead_actor) VALUES (${directorId},'${movieName}','${leadActor}');`
  await db.run(addMovieQuery)
  response.send('Movie Successfully Added')
})

//GET --> movieId

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMovieQuery = `
  SELECT
  movie_id as movieId,
  director_id as directorId,
  movie_name as movieName,
  lead_actor as leadActor
  FROM 
  movie
  WHERE movie_id = ${movieId};`
  const dbStatus = await db.get(getMovieQuery)
  response.send(dbStatus)
})

//Put --> movieId

app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const updateQuery = `
    UPDATE
    movie
    SET
    director_id = ${directorId},
    movie_name = '${movieName}',
    lead_actor = '${leadActor}'
    WHERE movie_id = ${movieId};`
  await db.run(updateQuery)
  response.send('Movie Details Updated')
})

//Delete --> movieId

app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteQuery = `
  DELETE
  FROM
  movie
  WHERE movie_id = ${movieId};`
  await db.run(deleteQuery)
  response.send('Movie Removed')
})

//Get

app.get('/directors/', async (request, response) => {
  const getDirectorQuery = `
  SELECT 
  director_id AS directorId,
  director_name AS directorName
  FROM 
  director;`
  const DBdirector = await db.all(getDirectorQuery)
  response.send(DBdirector)
})

//Get --> directorId

app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getMovieDirectorQuery = `
  SELECT 
  m.movie_name as movieName
  FROM 
  movie m 
  JOIN 
  director d
  ON m.director_id = d.director_id
  WHERE m.director_id = ${directorId};`
  const DBMovieDirector = await db.all(getMovieDirectorQuery)
  response.send(DBMovieDirector)
})

module.exports = app