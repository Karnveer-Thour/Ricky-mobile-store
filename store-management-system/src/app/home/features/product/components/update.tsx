"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/Button";
// import { CustomerUpdateformvalidationschema } from "@/Components/Customers/utils/Customerformvalidation";
import Inputcontainer from "@/components/Inputcontainer";
import Input from "@/components/Input";
import { useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { fields } from "../utils/objects";
import { CustomerUpdateformvalidationschema } from "../utils/customerformvalidation";

interface UpdateProps {
  handleUpdate: () => void;
  data?: Record<string, any>;
}

const Update = ({ handleUpdate, data }: UpdateProps) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(CustomerUpdateformvalidationschema),
    mode: "onChange", // Ensures real-time validation
    defaultValues:
      data ||
      (() => {
        const stored = localStorage.getItem("customerData");
        return stored ? JSON.parse(stored) : {};
      })(),
  });

  const formValues = watch();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Compare current form values with initial values
  const storedCustomerData = useMemo(() => {
    const data = localStorage.getItem("customerData");
    return data ? JSON.parse(data) : {};
  }, []);
  useEffect(() => {
    const hasChanges = Object.keys(formValues).some(
      (key) => formValues[key] !== (data?.[key] || storedCustomerData[key]),
    );
    setIsFormSubmitting(hasChanges && isValid); // Enable only if form is valid & has changes
  }, [formValues, isValid]);

  const onSubmit = (data: {
    name: string;
    email: string;
    manual_Login: boolean;
    rating: number;
  }) => {
    const customerDataString = localStorage.getItem("customerData");
    const customerData = customerDataString
      ? JSON.parse(customerDataString)
      : {};
    // dispatch(
    //   updateCustomer({
    //     customerId: customerData.id || "",
    //     body: data,
    //     handleUpdate,
    //   })
    // );
  };

  return (
    <div className="flex backdrop-blur-sm flex-col top-0 fixed z-50 w-screen h-screen items-center justify-center transition-all duration-300 rounded-lg">
      <span className="border w-[50%] p-5 -ms-20 rounded-xl bg-gray-100 shadow-md hover:shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-center">
          Update a Customer
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full gap-2 flex flex-col"
        >
          <Inputcontainer type={"name"} error={errors?.[fields.name]}>
            <Input
              {...register(fields.name)}
              placeholder="Enter name"
              id="name"
            />
          </Inputcontainer>
          <Inputcontainer type={"email"} error={errors?.[fields.email]}>
            <Input
              {...register(fields.email)}
              type="email"
              placeholder="Enter email"
              id="email"
            />
          </Inputcontainer>
          <Inputcontainer
            type={"manual Login"}
            error={errors?.[fields.manual_Login]}
          >
            <select
              {...register(fields.manual_Login)}
              className="mt-1 block w-full px-2 py-2 border-gray-500 rounded-md border-2 focus:ring-blue-300"
              id="manual  Login"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </Inputcontainer>
          <Inputcontainer type={"rating"} error={errors?.[fields.rating]}>
            <Input
              {...register(fields.rating)}
              type="text"
              id="rating"
              placeholder="Enter rating"
            />
          </Inputcontainer>
          <div className="w-full flex items-center justify-evenly">
            <div className="w-[30%]">
              <Button
                name={"cancel"}
                type="button"
                value="cancel"
                handler={handleUpdate}
              />
            </div>
            <div className="w-[30%]">
              <Button
                name={"Submit"}
                type="submit"
                disabled={!isFormSubmitting}
              />
            </div>
          </div>
        </form>
      </span>
    </div>
  );
};

export default Update;
