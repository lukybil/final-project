import "./SearchResults.css";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ExpTile, {checkExpAndFill} from "../Tile/Tile";
import { Grid } from "@mui/material";
import Search from '../Search/Search';

export default function SearchResults(props) {
  const [state, setState] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const db = props.db;

  let keyword;
  let resultExps = [];

  if ((keyword = searchParams.get("keyword")) !== null) { //simple search
    resultExps = db.getFilteredExps({keyword: keyword});
  }
  else { //advanced search
    let searchObject = JSON.parse(searchParams.get("searchObject"));
    searchObject.tags = JSON.parse(searchObject.tags);
    resultExps = db.getFilteredExps(searchObject);
  }

  //this part sets a random width of the resulting experiences in a grid and creates the result grid itself
  let first = 0;
  let counter = -1;
  let md;
  let gridTiles = resultExps.map((exp) => {
    counter++;
    if (counter % 2 === 0) {
      md = first = Math.round((Math.random()*4))+4;
    }
    else {
      md = 12 - first;
    }
    return (
      <Grid item xs={12} md={md}>
        <ExpTile exp={checkExpAndFill(exp)} db={db}/>
      </Grid>
    )
  });
  
  return (
    <main className="SearchResults">
      <h2>Search results</h2>
      <Search />
      <div className="main-flex">
        <Grid container spacing={2} className="main-Grid-container">
          {gridTiles}
        </Grid>
      </div>
    </main>
  );
}