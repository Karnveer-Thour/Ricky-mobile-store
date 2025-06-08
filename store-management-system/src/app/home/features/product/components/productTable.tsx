"use client";
import Table from "@/components/table/table";
import { Edit, TrashIcon } from "lucide-react";
import React, { useState } from "react";
import Update from "./update";
import Delete from "./Delete";

const ProductTable = () => {
  //   const navigate = useNavigate();
  //   const location = useLocation();
  //   const reduxData = useSelector((store) => store.customer?.customers);
  //   const Customers = useMemo(() => reduxData || [], [reduxData]);
  const [customerDeleting, setCustomerDeleting] = useState(false);
  const [customerData, setCustomerData] = useState({
    id: "",
    Name: "",
  });

  const handleDelete = (data: any) => {
    if (customerDeleting) {
      setCustomerDeleting(false);
    } else if (!customerDeleting) {
      setCustomerDeleting(true);
      setCustomerData({
        id: data._id,
        Name: data.name,
      });
    }
  };

  const handleUpdate = (data: any) => {
    if (location.pathname === "/customers") {
      //   navigate("/customers/update");
      const Data = {
        id: data._id,
        Name: data.name,
      };
      setCustomerData(Data);
      localStorage.setItem("customerData", JSON.stringify(Data));
    } else if (location.pathname === "/customers/update") {
      //   navigate("/customers");
      localStorage.removeItem("customerData");
    }
  };

  // Define table columns

  const columns = [
    {
      header: "Name",
      id: "Name",
      accessorKey: "name",
    },
    {
      header: "Category",
      id: "Category",
      accessorKey: "category",
    },
    {
      header: "Price",
      id: "Price",
      accessorKey: "price",
    },
    {
      header: "Quantity",
      id: "Quantity",
      accessorKey: "quantity",
    },
    {
      header: "Actions",
      id: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdate(row.original)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
          >
            <Edit />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  type ColumnKey = "ID" | "Name" | "Email" | "Rating" | "Actions";
  const [columnVisibility, setColumnVisibility] = useState<
    Record<ColumnKey, boolean>
  >({
    ID: true,
    Name: true,
    Email: true,
    Rating: true,
    Actions: true,
  });

  //   useEffect(() => {
  //     for (let key in columnVisibility) {
  //       if (key === "Actions") continue;
  //       if (columnVisibility[key as ColumnKey] === true) {
  //         isAction = true;
  //         break;
  //       }
  //     }
  //     }
  //     setColumnVisibility((prev) => ({ ...prev, Actions: isAction }));
  //   }, [
  //     columnVisibility.ID,
  //     columnVisibility.Name,
  //     columnVisibility.Email,
  //     columnVisibility.Rating,
  //   ]);

  return (
    <div className="w-[95%] sm:ms-7">
      {customerDeleting && (
        <Delete
          handleDelete={() => handleDelete(customerData)}
          Id={customerData?.id}
          Name={customerData?.Name}
        />
      )}
      {location.pathname === "/customers/update" && (
        <Update
          handleUpdate={() => handleUpdate(customerData)}
          data={customerData}
        />
      )}
      <Table
        columns={columns}
        data={[
          {
            name: "Product 1",
            category: "Category 1",
            price: 100,
            quantity: 10,
          }
        ]}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
      />
    </div>
  );
};

export default ProductTable;
