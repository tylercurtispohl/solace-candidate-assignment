"use client";

import { useEffect, useRef, useState } from "react";
import { Advocate } from "@/app/lib/types";

const headerColClassNames =
  "px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-700";

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
    <div className="px-6 flex flex-col">
      <div className="self-center w-full max-w-[1536px]">
        <div>
          <input
            ref={searchTermInputRef}
            style={{ border: "1px solid black" }}
            onChange={onSearchInputChange}
            placeholder="search..."
          />
          <button className="ml-2" onClick={onResetSearchClick}>
            <span className="font-semibold hover:text-red-700">X</span>
          </button>
        </div>
        <br />
        <br />
        {isDataLoading ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="border-b border-gray-300">
                <th className={headerColClassNames}>First Name</th>
                <th className={headerColClassNames}>Last Name</th>
                <th className={headerColClassNames}>City</th>
                <th className={headerColClassNames}>Degree</th>
                <th className={headerColClassNames}>Specialties</th>
                <th className={headerColClassNames}>Years of Experience</th>
                <th className={headerColClassNames}>Phone Number</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {filteredAdvocates.map((advocate) => {
                return (
                  <tr key={`${advocate.id}`} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{advocate.firstName}</td>
                    <td className="px-4 py-2">{advocate.lastName}</td>
                    <td className="px-4 py-2">{advocate.city}</td>
                    <td className="px-4 py-2">{advocate.degree}</td>
                    <td className="px-4 py-2 align-top">
                      <ul className="list-disc pl-5 space-y-1">
                        {advocate.specialties.map((s) => (
                          <li key={`${advocate.id}_${s}`}>{s}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2">{advocate.yearsOfExperience}</td>
                    <td className="px-4 py-2">{advocate.phoneNumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
