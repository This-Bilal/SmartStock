import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleSale } from "../../services/saleService";
import BackButton from "../../components/other/BackButton";
import { useTitle } from "../../hooks/useTitile";
import SaleCard from "./components/SaleCard";

const SaleDetails = () => {
  useTitle("SmartStock: sale details");

  const { saleNumber } = useParams();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSale = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSingleSale(saleNumber);
        setSale(data);
      } catch (error) {
        setError(
          error?.message || "Unable to load sale details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [saleNumber]);

  if (loading) {
    return (
      <main className=" min-h-screen w-full bg-red-50 py-10">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 sm:mb-5">
            <BackButton />
          </div>

          <div className=" flex flex-col items-center justify-center rounded-2xl py-10 bg-white p-4 shadow-md sm:p-5 lg:p-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>

            <p className="mt-3 text-xs text-gray-500 sm:text-sm">
              Loading sale details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen w-full bg-red-50 py-10">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 sm:mb-5">
            <BackButton />
          </div>

          <div className="flex items-center justify-center py-10 shadow-sm rounded-lg bg-white p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!sale) {
    return (
      <main className="w-full bg-red-50 py-10">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 sm:mb-5">
            <BackButton />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">Sale not found.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className=" min-h-screen w-full bg-red-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-5">
          <BackButton />
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Sale Details
          </h1>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Complete information about sale {sale.saleNumber}.
          </p>
        </div>

        {/* Sale Summary */}
        <div className="mb-6 max-w-xl">
          <SaleCard sale={sale} />
        </div>

        {/* Sale Information */}
        <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Section Header */}
          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-gray-800 sm:text-base">
              Transaction Information
            </h2>
          </div>

          {/* Information */}
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            {/* Sale Number */}
            <div>
              <p className="text-xs text-gray-400">Sale Number</p>

              <p className="mt-1 text-sm font-medium text-gray-700">
                {sale.saleNumber}
              </p>
            </div>

            {/* Employee */}
            <div>
              <p className="text-xs text-gray-400">Employee</p>

              <p className="mt-1 text-sm font-medium text-gray-700">
                {sale.employeeName}
              </p>
            </div>

            {/* Role */}
            <div>
              <p className="text-xs text-gray-400">Employee Role</p>

              <p className="mt-1 text-sm font-medium capitalize text-gray-700">
                {sale.employeeRole}
              </p>
            </div>

            {/* Date */}
            <div>
              <p className="text-xs text-gray-400">Date and time</p>

              <p className="mt-1 text-sm font-medium text-gray-700">
                {sale.date}
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <p className="text-xs text-gray-400">Payment Method</p>

              <p className="mt-1 text-sm font-medium capitalize text-gray-700">
                {sale.paymentMethod}
              </p>
            </div>

            {/* Payment Status */}
            <div>
              <p className="text-xs text-gray-400">Payment Status</p>

              <span className="mt-1 inline-block rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium capitalize text-green-700">
                {sale.paymentStatus}
              </span>
            </div>

            {/* Sale Status */}
            <div>
              <p className="text-xs text-gray-400">Sale Status</p>

              <span className="mt-1 inline-block rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium capitalize text-blue-700">
                {sale.status}
              </span>
            </div>

            {/* Total */}
            <div>
              <p className="text-xs text-gray-400">Total Amount</p>

              <p className="mt-1 text-base font-bold text-gray-800">
                ₦{sale.totalAmount?.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Section Header */}
          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-gray-800 sm:text-base">
              Products Sold
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Products included in this transaction.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    Product
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    SKU
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    Quantity
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    Unit Price
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    Subtotal
                  </th>
                </tr>
              </thead>

              <tbody>
                {sale.items?.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    {/* Product */}
                    <td className="px-5 py-4 text-sm font-medium text-gray-700">
                      {item.productName}
                    </td>

                    {/* SKU */}
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {item.sku}
                    </td>

                    {/* Quantity */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {item.quantity}
                    </td>

                    {/* Unit Price */}
                    <td className="px-5 py-4 text-sm text-gray-600">
                      ₦{item.unitPrice?.toLocaleString()}
                    </td>

                    {/* Subtotal */}
                    <td className="px-5 py-4 text-sm font-semibold text-gray-700">
                      ₦{item.subtotal?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Products */}
          <div className="divide-y divide-gray-100 md:hidden">
            {sale.items?.map((item, index) => (
              <div key={item.id || index} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-700">
                      {item.productName}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">{item.sku}</p>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-gray-800">
                    ₦{item.subtotal?.toLocaleString()}
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  {/* Quantity */}
                  <div>
                    <p className="text-gray-400">Quantity</p>

                    <p className="mt-1 font-medium text-gray-600">
                      {item.quantity}
                    </p>
                  </div>

                  {/* Unit Price */}
                  <div>
                    <p className="text-gray-400">Unit Price</p>

                    <p className="mt-1 font-medium text-gray-600">
                      ₦{item.unitPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
            <span className="text-sm font-medium text-gray-600">
              Total Amount
            </span>

            <span className="text-base font-bold text-gray-800 sm:text-lg">
              ₦{sale.totalAmount?.toLocaleString()}
            </span>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SaleDetails;
