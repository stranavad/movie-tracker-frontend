import React from "react";
import PropTypes from "prop-types";
import axios from 'axios';
//
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import { Button, CardActions } from "@mui/material";

import Search from "./Search";
import Movie from "./Movie";

class Movies extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			propsMovies: [],
			movies: [],
			showInfo: false,
			movie: {},
		};
		this.filterMovies = this.filterMovies.bind(this);
		this.closeMovie = this.closeMovie.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.movies !== this.props.movies) {
			this.setState({
				propsMovies: this.props.movies,
				movies: this.props.movies,
			});
		}
	}

	filterMovies(movieName) {
		let newMovies = this.state.propsMovies.filter((movie) =>
			movie.title.toLowerCase().includes(movieName.toLowerCase())
		);
		this.setState({ movies: newMovies });
	}

	closeMovie() {
		this.setState({ showInfo: false, movie: {} });
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

	render() {
		return (
			<Stack spacing={4} alignItems="center">
				{this.state.showInfo ? (
					<Movie
						movie={this.state.movie}
						closeMovie={this.closeMovie}
					/>
				) : (
					""
				)}
				<Search filterMovies={this.filterMovies} />
				<Grid
					container
					spacing={2}
					sx={{ maxWidth: 1200, paddingTop: 3 }}
				>
					{this.state.movies.map((movie) => (
						<Grid item lg={4} sm={6} xs={12} key={movie.id}>
							<Card sx={{ width: "auto", minHeight: 400 }}>
								<CardActionArea
									onClick={() => this.showInfo(movie)}
								>
									<CardMedia
										component="img"
										height="200"
										image={movie.photo}
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
										onClick={() =>
											this.props.deleteMovie(movie)
										}
									>
										Remove
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>
			</Stack>
		);
	}
}

Movies.propTypes = {
	movies: PropTypes.array,
	genres: PropTypes.array,
	deleteMovie: PropTypes.func.isRequired,
};

export default Movies;
