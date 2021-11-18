import React from "react";
import Grid from "@mui/material/Grid";
import '../common.css';
import "./Home.css";
import Tile from "../Tile/Tile";
import Athens from "../img/content/athens.jpg";
import Madrid from "../img/content/madrid.jpg";
import Vienna from "../img/content/vienna.jpg";
import London from "../img/content/london.jpg";

class Home extends React.Component {
	constructor(props) {
		super();
	}

	render() {
		return (
			<main className="Home">
				<h2>Find your perfect trip</h2>
				<form>
					<input type="text" className="main-search" placeholder="author, name, location,..."/>
				</form>
				<div className="main-Grid-wrapper">
					<Grid container spacing={2}>
						<Grid item xs={12} md={8}>
							<Tile img={Athens} h2="Greece" h1="Athens"/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Tile img={Madrid} h2="Spain" h1="Madrid"/>
						</Grid>
						<Grid item xs={12} md={4}>
							<Tile img={Vienna} h2="Austria" h1="Vienna"/>
						</Grid>
						<Grid item xs={12} md={8}>
							<Tile img={London} h2="England" h1="London"/>
						</Grid>
					</Grid>
				</div>
			</main>
		);
	}
}

export default Home;