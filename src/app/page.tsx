"use client";

import { useEffect, useRef, useState } from "react";
import { Advocate } from "./lib/types";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTermInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTermValue = e.target.value;
    const loweredSearchTermValue = searchTermValue.toLowerCase();

    setSearchTerm(searchTermValue);

    const filteredAdvocates = advocates.filter((advocate) => {
      const advocateFullName = `${advocate.firstName} ${advocate.lastName}`;

      return (
        advocateFullName.toLowerCase().includes(loweredSearchTermValue) ||
        advocate.city.toLowerCase().includes(loweredSearchTermValue) ||
        advocate.degree.toLowerCase().includes(loweredSearchTermValue) ||
        advocate.specialties.some((s) =>
          s.toLowerCase().includes(loweredSearchTermValue)
        ) ||
        advocate.yearsOfExperience.toString().includes(loweredSearchTermValue)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    setFilteredAdvocates(advocates);
    setSearchTerm("");

    // Reset the input element to empty
    const inputEl = searchTermInputRef.current;

    if (!inputEl) return;

    inputEl.value = "";
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>Searching for: {searchTerm}</p>
        <input
          ref={searchTermInputRef}
          style={{ border: "1px solid black" }}
          onChange={onChange}
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={`${advocate.id}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={`${advocate.id}_${s}`}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
