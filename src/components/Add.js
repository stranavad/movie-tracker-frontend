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
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Button, CardActionArea } from "@mui/material";
// Alert components
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.addMovie = this.addMovie.bind(this);
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
					let pushMovies = [];
					for (let i = 0; i < data.data.results.length; i++) {
						if (
							!this.state.moviesIds.includes(
								data.data.results[i].id
							)
						) {
							console.log("found movie" + data.data.results[i]);
							pushMovies.push(data.data.results[i]);
						}
					}
					this.setState({ movies: pushMovies });
					console.log(pushMovies);
				} else {
					console.log("showing warning");
					this.setState({
						showAlert: true,
						alertSeverity: "error",
						alertText: this.state.alertNoMoviesError,
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
	}

	addMovie(movie) {
		const params = {
			id: this.props.user.uid,
			title: movie.title,
			movie_id: parseInt(movie.id, 10),
			photo: "https://image.tmdb.org/t/p/w500/" + movie.backdrop_path,
			year: parseInt(movie.release_date.split("-")[0], 10),
			rating: parseInt(parseFloat(movie.vote_average) * 10, 10),
		};
		axios.post("http://localhost:5000/user", params).then((data) => {
			if (data.data.code === 112) {
				// success alert
				console.log("success alert");
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
		this.props.history.push("/");
	}

	render() {
		return (
			<Stack spacing={4} alignItems="center" pt={5}>
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
										{movie.backdrop_path ? (
											<CardMedia
												component="img"
												height="200"
												image={
													"https://image.tmdb.org/t/p/w500/" +
													movie.backdrop_path
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
											</Typography>
										</CardContent>
									</CardActionArea>
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
			</Stack>
		);
	}
}

Add.propTypes = {
	user: PropTypes.object.isRequired,
};

export default withRouter(Add);
