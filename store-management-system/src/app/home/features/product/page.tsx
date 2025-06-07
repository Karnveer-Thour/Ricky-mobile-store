"use client";
import ProductTable from "./components/productTable";

function page() {
  return (
    <>
      <div className=" overflow-hidden sm:ms-5 me-9 mt-3 max-sm:ms-4 h-auto flex max-sm:flex-col max-sm:justify-center items-center gap-4">
        <p className="text-3xl text-gray-700 ">products</p>
        <hr className="border-t-3 border-gray-700 mt-1 flex-1"></hr>
      </div>
      <div className="w-full h-[50vh] flex justify-center">
        <ProductTable />
      </div>
    </>
  );
}

export default page;
