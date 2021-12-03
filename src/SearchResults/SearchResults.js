import "./SearchResults.css";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ExpTile, {checkExpAndFill} from "../Tile/Tile";
import { Grid } from "@mui/material";

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
      <div className="main-flex">
        <span>Search results</span><br/>
        <Grid container spacing={2} className="main-Grid-container">
          {gridTiles}
        </Grid>
      </div>
    </main>
  );
}