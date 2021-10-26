import React, { Component } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movieName: ""
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({ movieName: e.target.value });
        // run a function to filter the movies
        this.props.filterMovies(e.target.value);
    }

	render() {
		return (
			<div>
                <Box component="form" autoComplete="off" noValidate sx={{maxWidth: 1200, paddingTop: 3}}>
                    <TextField id="movieName" label="Movie Name" variant="outlined" value={this.state.movieName} onChange={this.onChange}/>
                </Box>
			</div>
		);
	}
}

Search.propTypes = {
    filterMovies: PropTypes.func.isRequired,
}

export default Search;
