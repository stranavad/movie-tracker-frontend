import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
//MUI
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Button, CardActionArea } from "@mui/material";
import Fab from "@mui/material/Fab";
import CloseIcon from "@mui/icons-material/Close";
import BackspaceIcon from "@mui/icons-material/Backspace";
// Alert components
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Movie from "./Movie";

class Add extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			movieName: "",
			movies: [],
			moviesIds: [],
			displayForm: true,
			showAlert: false,
			redirect: false,
			alertText: "",
			alertMovieAlready: "You already have this movie in your portfolio",
			alertServerError:
				"There was some error-5xx, try again in few minutes",
			alertNoMoviesError: "No movies found with this name",
			showInfo: false,
			movie: {},
			args: {},
			genres: [],
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.addMovie = this.addMovie.bind(this);
		this.cleanSearch = this.cleanSearch.bind(this);
		this.closeMovie = this.closeMovie.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		// Make imdb search
		axios
			.get("https://api.themoviedb.org/3/search/movie", {
				params: {
					api_key: "09d7e4ead1bd7096e0f4b6c56da951a8",
					query: this.state.movieName,
				},
			})
			.then((data) => {
				if (data.data.results.length !== 0) {
					console.log("running in main");
					// not show movies, that are already added in portfolio
					let pushMovies = [];
					for (let i = 0; i < data.data.results.length; i++) {
						if (
							// checking if movie is already in database
							!this.state.moviesIds.includes(
								data.data.results[i].id
							)
						) {
							let movie = data.data.results[i];
							let newMovie = {};
							newMovie.genres = movie.genre_ids.map(
								(id) => this.state.genres[id]
							);
							newMovie.year = parseInt(
								movie.release_date.split("-")[0],
								10
							);
							newMovie.overview = movie.overview;
							newMovie.id = parseInt(movie.id, 10);
							newMovie.title = movie.title;
							newMovie.rating = parseInt(
								parseFloat(movie.vote_average) * 10,
								10
							);
							if (movie.backdrop_path) {
								newMovie.photo =
									"https://image.tmdb.org/t/p/w500/" +
									movie.backdrop_path;
							} else {
								newMovie.photo = "";
							}

							pushMovies.push(newMovie);
						}
					}
					this.setState({ movies: pushMovies });
				} else {
					console.log("showing warning");
					this.setState({
						showAlert: true,
						alertSeverity: "error",
						alertText: this.state.alertNoMoviesError,
						displayForm: true,
					});
				}
			});
		this.setState({ movieName: "", displayForm: false });
	}

	componentDidMount() {
		axios
			.get("http://localhost:5000/user/moviesids", {
				params: {
					id: this.props.user.uid,
				},
			})
			.then((data) => {
				if (data.data.code === 104) {
					this.setState({ moviesIds: data.data.movies });
				} else {
					console.log("Backend error");
					console.log(
						"Error: " + data.data.code + " - " + data.data.errno
					);
				}
			});

		axios
			.get("https://api.themoviedb.org/3/genre/movie/list", {
				params: { api_key: "09d7e4ead1bd7096e0f4b6c56da951a8" },
			})
			.then((req) => {
				let genres = {};
				for (let i = 0; i < req.data.genres.length; i++) {
					genres[req.data.genres[i].id] = req.data.genres[i].name;
				}
				this.setState({ genres: genres });
			});
	}

	cleanSearch() {
		this.setState({ movies: [], movieName: "", displayForm: true });
	}

	closeMovie() {
		this.setState({ movie: {}, showInfo: false, args: {} });
	}

	async showInfo(movie) {
		let actors = [];
		await axios
			.get(
				"https://api.themoviedb.org/3/movie/" +
					parseInt(movie.id, 10) +
					"/credits",
				{
					params: {
						api_key: "09d7e4ead1bd7096e0f4b6c56da951a8",
					},
				}
			)
			.then((req) => {
				actors = req.data.cast;
			});
		let newMovie = {
			...movie, actors
		};
		this.setState({ showInfo: true, movie: newMovie });
	}

	addMovie(movie) {
		// change user_id, movie_id, and id naming scheme
		const params = {
			...movie
		};
		params.movie_id = movie.id;
		params.id = this.props.user.uid;
		console.log(params.genres);
		axios.post("http://localhost:5000/user", params).then((data) => {
			if (data.data.code === 112) {
				// success alert
				console.log("success alert");
				// remove movie from list
				// TODO: change to more efficient way
				let newMovies = this.state.movies;
				for (let i = 0; i < newMovies.length; i++) {
					if (newMovies[i].id === movie.id) {
						newMovies.splice(i, 1);
					}
				}
				this.setState({ movies: newMovies });
			} else {
				console.log("Backend error");
				console.log(
					"Error: " + data.data.code + " - " + data.data.errno
				);
				this.setState({
					showAlert: true,
					alertSeverity: "error",
					alertText: this.state.alertServerError,
				});
			}
		});
	}

	render() {
		return (
			<Stack spacing={4} alignItems="center" pt={5}>
				{this.state.showInfo ? (
					<Movie
						movie={this.state.movie}
						closeMovie={this.closeMovie}
						args={this.state.args}
					/>
				) : (
					""
				)}
				{this.state.displayForm ? (
					<Box
						sx={{
							width: 450,
							minHeight: 400,
							borderRadius: 5,
						}}
					>
						<Stack
							alignItems="center"
							pt={2}
							spacing={4}
							component="form"
							id="searchForm"
							onSubmit={this.onSubmit}
						>
							<Typography component="h2">
								Search a Movie
							</Typography>
							<TextField
								id="movieName"
								name="movieName"
								label="Movie name"
								variant="outlined"
								value={this.state.movieName}
								autoFocus
								onChange={(e) =>
									this.setState({
										[e.target.name]: e.target.value,
									})
								}
							/>
							<Button
								variant="contained"
								type="submit"
								form="searchForm"
							>
								Search
							</Button>
						</Stack>
					</Box>
				) : (
					<Grid container spacing={2} sx={{ maxWidth: 1200 }}>
						{this.state.movies.map((movie) => (
							<Grid item lg={4} sm={6} xs={12} key={movie.id}>
								<Card sx={{ width: "auto", minHeight: 300 }}>
									<CardActionArea
										onClick={() => this.addMovie(movie)}
									>
										{movie.photo ? (
											<CardMedia
												component="img"
												height="200"
												image={
													movie.photo
												}
												alt="Movie image isn't available"
											/>
										) : (
											<CardMedia
												component="img"
												height="200"
												image={
													"https://betravingknows.com/wp-content/uploads/2017/06/video-movie-placeholder-image-grey.png"
												}
												alt="Movie image isn't available"
											/>
										)}
										<CardContent>
											<Typography
												gutterBottom
												variant="h4"
												component="div"
												className=""
											>
												{movie.title}
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary"
											>
												{movie.year}
												{movie.genres.map(
													(genre) => " - " + genre
												)}
											</Typography>
										</CardContent>
									</CardActionArea>
									<CardActions>
										<Button
											size="small"
											color="primary"
											onClick={() => this.showInfo(movie)}
										>
											Info
										</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				)}
				{
					// alert for when movie is already added
				}
				<Snackbar
					open={this.state.showAlert}
					autoHideDuration={6000}
					onClose={() => this.setState({ showAlert: false })}
				>
					<Alert
						onClose={() => this.setState({ showAlert: false })}
						severity={this.state.alertSeverity}
						sx={{ width: "100%" }}
					>
						{this.state.alertText}
					</Alert>
				</Snackbar>
				<Box sx={{ position: "fixed", right: 50, bottom: 50 }}>
					<a href="/">
						<Fab color="primary" aria-label="Close">
							<CloseIcon />
						</Fab>
					</a>
				</Box>
				<Box sx={{ position: "fixed", right: 50, bottom: 120 }}>
					<Fab
						color="primary"
						aria-label="Clear"
						onClick={this.cleanSearch}
					>
						<BackspaceIcon />
					</Fab>
				</Box>
			</Stack>
		);
	}
}

Add.propTypes = {
	user: PropTypes.object.isRequired,
};

export default withRouter(Add);
