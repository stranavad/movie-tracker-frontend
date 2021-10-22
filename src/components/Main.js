import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Movies from "./Movies";

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
				for (let i = 0; i < this.state.movies.length; i++) {
					if (this.state.movies[i].movie_table_id === movie.movie_table_id) {
						this.setState({ movies: this.state.movies.splice(i, 1) });
					}
				}
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
			</div>
		);
	}
}

Main.propTypes = {
	user: PropTypes.object.isRequired,
};

export default Main;

