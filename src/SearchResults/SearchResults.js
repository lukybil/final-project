import "./SearchResults.css";
import { useState } from "react";

export default function SearchResults(props) {
  const {state, setState} = useState({});
  return (
    <div className="SearchResults">
      <span>Search results</span>
    </div>
  );
}