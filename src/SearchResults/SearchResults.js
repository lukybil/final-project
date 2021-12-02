import "./SearchResults.css";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchResults(props) {
  const [state, setState] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  let tags = JSON.parse(searchParams.get("tags"));
  let tagsSpan = tags.map(tag => {
    return <div>{tag}</div>
  });
  return (
    <div className="SearchResults">
      <span>Search results</span><br/>
      {tagsSpan}
    </div>
  );
}