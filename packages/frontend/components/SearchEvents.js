import { useState } from "react";
import { useAccount } from "wagmi";

const SearchEvents = () => {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input
        placeholder="Search for Events"
        onChange={(e) => setQuery(e.target.value)}
      />
      {}
    </div>
  );
};

export default SearchEvents;
