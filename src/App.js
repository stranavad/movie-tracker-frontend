import React from "react";
import "./App.css";
import Main from "./components/Main";
import Menu from "./components/Menu";
import Add from "./components/Add";
// Material UI
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";

const firebaseConfig = {
	apiKey: "AIzaSyB4mL0dye_PihEZicW6NqpoRp7PD8vlyI8",
	authDomain: "movie-tracker-9051b.firebaseapp.com",
	projectId: "movie-tracker-9051b",
	storageBucket: "movie-tracker-9051b.appspot.com",
	messagingSenderId: "793966122239",
	appId: "1:793966122239:web:8216845748ff45ee5468ca",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
// End of Firebase configuration

function App() {
	const [user] = useAuthState(auth);
	return (
		<div className="app">
			<Router>
				<Menu signOut={signOut} auth={auth} signIn={signInWithGoogle} />
				<Switch>
					<Route path="/add">
						{auth.currentUser ? (
							<Add user={user} />
						) : (
							<Button color="primary" onClick={signInWithGoogle}>
								Login
							</Button>
						)}
					</Route>
					<Route path="/">
						{auth.currentUser ? (
							<Main user={user} />
						) : (
							<Button color="primary" onClick={signInWithGoogle}>
								Login
							</Button>
						)}
					</Route>
				</Switch>
			</Router>
		</div>
	);
}
export default App;

export const signInWithGoogle = () => {
	let provider = new GoogleAuthProvider();
	signInWithPopup(auth, provider)
		.then((result) => {
			const credential = GoogleAuthProvider.credentialFromResult(result);
			//const token = credential.accessToken;
			const user = result.user;
			console.log(user);
		})
		.catch((error) => {
			// const errorCode = error.code;
			const errorMessage = error.message;
			// const email = error.email;
			// const credential = GoogleAuthProvider.credentialFromError(error);
			console.log(errorMessage);
		});
};

export function signOut() {
	if (auth.currentUser) {
		auth.signOut();
	}
}
