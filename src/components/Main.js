import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Movies from "./Movies";

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			movies: [],
		};
  }

	removeMovie = (movie) => {
		axios.delete("http://localhost:5000/user",
			{
				params: {
					id: this.props.user.uid,
					movie_id: movie.movie_table_id,
			}
			}).then((data) => {
				// error codes from backend
				console.log(data.data.code)
				// removing movie from state
				var newMovies = this.state.movies;
				for (let i = 0; i < newMovies.length; i++) {
					if (newMovies[i].movie_table_id === movie.movie_table_id) {
						newMovies.splice(i, 1);
					}
				}
				this.setState({ movies: newMovies });
				console.log(this.state.movies);
		})
	};

	componentDidMount() {
		axios
			.get("http://localhost:5000/user", {
				params: {
					id: this.props.user.uid,
				},
			})
			.then((data) => {
				console.log(data.data);
				if (data.data.code === 104) {
					let moviesNew = [];
					for (const property in data.data.movies) {
						moviesNew.push({
							id: property,
							...data.data.movies[property],
						});
					}
					this.setState({ movies: moviesNew });
				} else {
					console.log("Backend error")
					console.log("Error code" + data.data.code + " - " + data.data.errno)
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	render() {
		return (
			<div>
				<Movies
					movies={this.state.movies}
					deleteMovie={this.removeMovie}
				/>
				<Box sx={{ position: "fixed", right: 50, bottom: 50 }}>
					<a href="/add">
						<Fab color="primary" aria-label="add">
							<AddIcon />
						</Fab>
					</a>
				</Box>
			</div>
		);
	}
}

Main.propTypes = {
	user: PropTypes.object.isRequired,
};

export default Main;

