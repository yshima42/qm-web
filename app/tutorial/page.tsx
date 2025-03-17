import FetchDataSteps from "@/components/tutorial/fetch-data-steps";

export default  function Home() {
  return (
    <div className="flex w-full flex-1 flex-col gap-12">
      <div className="flex flex-col items-start gap-2">
        <h2 className="mb-4 text-2xl font-bold">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
