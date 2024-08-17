import React, { useEffect, useState } from "react";
import { SummaryApi } from "../common";
import EventCard from "../components/EventCard";

function Search() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const fetchEvents = async () => {
    const res = await fetch(SummaryApi.events.get);
    const d = await res.json();
    setEvents(d.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (search == "") {
      setFiltered(events);
      return;
    }

    let filtered = events.filter((ev) =>
      ev.name.toLowerCase().match(search.toLowerCase())
    );
    filtered = filtered.concat(
      events.filter(
        (ev) =>
          ev.place.name.toLowerCase().match(search.toLowerCase()) &&
          filtered.indexOf(ev) == -1
      )
    );
    filtered = filtered.concat(
      events.filter(
        (ev) =>
          ev.category.name.toLowerCase().match(search.toLowerCase()) &&
          filtered.indexOf(ev) == -1
      )
    );
    setFiltered(filtered);
  }, [search]);

  return (
    <div className="my-4 mx-6">
      <div className="mx-auto w-32 items-center flex flex-col">
        <h2 className="text-3xl font-semibold py-4 text-blue-900 capitalize">
          Search
        </h2>
        <div className="w-12 h-2 bg-yellow-500"></div>
      </div>
      <div className="mx-auto w-96 mt-6 h-10">
        <input
          onChange={handleSearchInput}
          value={search}
          type="text"
          className="
            px-4 
            py-2 
            w-full 
            border-2 
          border-gray-300 
            rounded-md 
            outline-none 
            shadow-sm 
          focus:border-blue-500 
            focus:shadow-lg 
            transition-all 
            duration-300 
            ease-in-out 
          hover:border-gray-500 
          placeholder-gray-500
  "
          placeholder="Search..."
        />
      </div>

      <div className="mx-auto grid grid-cols-3">
        {filteredEvents.length !== 0 ? (
          filteredEvents.map((ev, id) => {
            return (
              <div className="mx-auto py-4">
                <EventCard
                  key={ev.name + id}
                  event={ev}
                />
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Search;
