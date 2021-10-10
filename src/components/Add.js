import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
//MUI
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Button, CardActionArea } from "@mui/material";

class Add extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			movieName: "",
			movies: [],
			moviesIds: [],
			displayForm: true,
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
				this.setState({ movies: data.data.results });
				console.log(data.data.results);
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
				this.setState({ moviesIds: data.data.movies });
			});
	}

	addMovie(movie) {
		const params = {
			id: this.props.user.uid,
			title: movie.title,
			movie_id: parseInt(movie.id),
			photo: "https://image.tmdb.org/t/p/w500/" + movie.backdrop_path,
			year: parseInt(movie.release_date.split("-")[0]),
			rating: parseInt(parseFloat(movie.vote_average) * 10),
		};
		
		if (!this.state.moviesIds.includes(movie.id)) {
			// we can add movie to database
			axios.post("http://localhost:5000/user", params).then((data) => {
				console.log(data.data.message);
			});
		} else {
			// movie is already in database
			console.log("Movie is already in DB");
		}
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
								<Card sx={{ width: "auto", minHeight: 400 }}>
									<CardActionArea onClick={() => this.addMovie(movie)}>
										<CardMedia
											component="img"
											height="200"
											image={
												"https://image.tmdb.org/t/p/w500/" +
												movie.backdrop_path
											}
											alt="Movie image isn't available"
										/>
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
			</Stack>
		);
	}
}

Add.propTypes = {
	user: PropTypes.object.isRequired,
};

export default Add;
