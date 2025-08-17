"use client";

import { useEffect, useRef, useState } from "react";
import { Advocate } from "@/app/lib/types";

export default function AdvocateSearchTable() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTermInputRef = useRef<HTMLInputElement>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsDataLoading(true);
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setIsDataLoading(false);
      });
    });
  }, []);

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTermValue = e.target.value;
    const loweredSearchTermValue = searchTermValue.toLowerCase();

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
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
    }, 300);
  };

  const onResetSearchClick = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    setFilteredAdvocates(advocates);
    setSearchTerm("");

    // Reset the input element to empty
    const inputEl = searchTermInputRef.current;

    if (!inputEl) return;

    inputEl.value = "";
  };

  return (
    <>
      <div>
        <p>Search</p>
        <p>Searching for: {searchTerm}</p>
        <input
          ref={searchTermInputRef}
          style={{ border: "1px solid black" }}
          onChange={onSearchInputChange}
        />
        <button onClick={onResetSearchClick}>Reset Search</button>
      </div>
      <br />
      <br />
      {isDataLoading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>City</th>
              <th>Degree</th>
              <th>Specialties</th>
              <th>Years of Experience</th>
              <th>Phone Number</th>
            </tr>
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
      )}
    </>
  );
}
