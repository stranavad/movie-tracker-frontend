import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";

import Fab from "@mui/material/Fab";
import CloseIcon from "@mui/icons-material/Close";

class Movie extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			movie: {},
			actors: [],
		};
		this.onClose = this.onClose.bind(this);
	}

	onClose() {
		this.setState({ actors: [] });
		this.props.closeMovie();
	}

	render() {
		return (
			<Box
				sx={{
					position: "absolute",
					zIndex: 2,
					backgroundColor: "white",
					width: "100vw",
					minHeight: "100vh",
					top: "10vh",
				}}
			>
				<Stack alignItems="center" width="100%">
					<Card sx={{ maxWidth: "1100px", minHeight: 300 }}>
						<Stack direction="row" spacing={2}>
							{this.props.movie.photo ? (
								<CardMedia
									component="img"
									sx={{ minWidth: "500px" }}
									image={
										"https://image.tmdb.org/t/p/w500/" +
										this.props.movie.photo
									}
									alt="Movie image isn't available"
								/>
							) : (
								<CardMedia
									component="img"
									sx={{ minWidth: "500px" }}
									image={
										"https://betravingknows.com/wp-content/uploads/2017/06/video-movie-placeholder-image-grey.png"
									}
									alt="Movie image isn't available"
								/>
							)}
							<CardContent>
								<Typography
									variant="h4"
									component="div"
									className=""
								>
									{this.props.movie.title}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{this.props.movie.year}
									{this.props.movie.genres.map(
										(genre) => " - " + genre
									)}
								</Typography>
								<Typography
									variant="body1"
									color="text.primary"
								>
									{this.props.movie.overview}
								</Typography>
							</CardContent>
						</Stack>
						{
							//actors component
						}
						<Grid
							container
							spacing={4}
							sx={{ width: "100%", paddingTop: 2 }}
						>
							{this.props.movie.actors.map((actor) => (
								<Grid item sm={6} key={actor.credit_id}>
									<Stack direction="row" spacing={1}>
										<Link
											href={
												"https://image.tmdb.org/t/p/w500" +
												actor.profile_path
											}
											target="_blank"
											rel="noopener"
										>
											<Avatar
												alt={actor.name}
												sx={{
													height: 60,
													width: 60,
												}}
												src={
													"https://image.tmdb.org/t/p/w500" +
													actor.profile_path
												}
											/>
										</Link>
										<Stack direction="column" spacing={1}>
											<Typography variant="h6">
												{actor.name}
											</Typography>
											<Typography variant="body1">
												{actor.character}
											</Typography>
										</Stack>
									</Stack>
								</Grid>
							))}
						</Grid>
					</Card>
				</Stack>
				<Box sx={{ position: "fixed", right: 50, bottom: 50 }}>
					<Fab
						color="primary"
						aria-label="close"
						onClick={this.onClose}
					>
						<CloseIcon />
					</Fab>
				</Box>
			</Box>
		);
	}
}

Movie.propTypes = {
	movie: PropTypes.object.isRequired,
	closeMovie: PropTypes.func.isRequired,
};

export default Movie;
