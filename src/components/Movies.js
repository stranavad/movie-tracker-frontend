import React from "react";
import PropTypes from "prop-types";
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
			showMovie: false,
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
		this.setState({showMovie: false, movie: {}});
	}

	render() {
		return (
			<Stack spacing={4} alignItems="center">
				{this.state.showMovie ? (
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
									onClick={() =>
										this.setState({
											showMovie: true,
											movie: movie,
										})
									}
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
	deleteMovie: PropTypes.func.isRequired,
};

export default Movies;
