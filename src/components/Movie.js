import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

class Movie extends React.Component {
	constructor(props) {
		super(props);
        this.state = {
            actors: [],
        };
	}

	componentDidMount() {
		// get data from tmdb
		console.log("movie: " + this.props.movie_id);
		axios
			.get(
				"https://api.themoviedb.org/3/movie/" +
					parseInt(this.props.movie_id, 10),
				{
					params: {
						api_key: "09d7e4ead1bd7096e0f4b6c56da951a8",
					},
				}
			)
			.then((req) => {
				console.log(req.data);
            });
        
        // getting actors
		axios
			.get(
				"https://api.themoviedb.org/3/movie/" +
					parseInt(this.props.movie_id, 10) +
					"/credits",
				{
					params: {
						api_key: "09d7e4ead1bd7096e0f4b6c56da951a8",
					},
				}
			)
			.then((req) => {
                this.setState({ actors: req.data.cast });
			});
	}

	render() {
		return <h1>Movie info component</h1>;
	}
}

Movie.propTypes = {
	movie_id: PropTypes.string.isRequired,
};

export default Movie;
