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

	removeMovie = (id) => {
		console.log("Removing movie" + id);
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
					removeMovie={this.removeMovie}
				/>
			</div>
		);
	}
}

Main.propTypes = {
	user: PropTypes.object.isRequired,
};

export default Main;
