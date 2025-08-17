import AdvocateSearchTable from "./components/advocates/advocate-search-table";

export default async function Home() {
  return (
    <main>
      <div className="mb-12 p-6 bg-green-800">
        <div className="mx-auto max-w-[1536px]">
          <h1 className="text-white text-4xl">Solace Advocates</h1>
        </div>
      </div>
      <AdvocateSearchTable />
    </main>
  );
}
