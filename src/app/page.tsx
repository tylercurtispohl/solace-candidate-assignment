import AdvocateSearchTable from "./components/advocates/advocate-search-table";

export default async function Home() {
  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <AdvocateSearchTable />
    </main>
  );
}
