import React from "react";
//
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActions } from "@mui/material";

function Movies(props) {
	return (
		<Stack spacing={4} alignItems="center">
			<Grid container spacing={2} sx={{ maxWidth: 1200 }}>
				{props.movies.map((movie) => (
					<Grid item lg={4} sm={6} xs={12} key={movie.id}>
						<Card sx={{ width: "auto", minHeight: 400 }}>
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
							<CardActions>
								<Button
									size="small"
									color="primary"
									onClick={() =>
										console.log("Removing movie" + movie.id)
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

export default Movies;
