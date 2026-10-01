import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../services/paymentService";

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    const verifySubscriptionPayment = async () => {
      const callbackReference = searchParams.get("reference");

      if (!callbackReference) {
        setStatus("error");
        setMessage("Payment reference was not found.");
        return;
      }

      setReference(callbackReference);

      try {
        const response = await verifyPayment(callbackReference);

        // Payment was successfully verified.
        sessionStorage.removeItem("smartstock_payment");

        setStatus("success");
        setMessage(response?.message || "Payment verified successfully.");
      } catch (error) {
        const errorMessage =
          error?.message || "Payment was not completed successfully.";

        setStatus("failed");
        setMessage(errorMessage);
      }
    };

    verifySubscriptionPayment();
  }, [searchParams]);

  const handleContinue = () => {
    navigate("/subscriptionPage", {
      replace: true,
    });
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-red-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-md sm:p-8">
        {/* Verifying */}
        {status === "verifying" && (
          <>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />

            <h1 className="mt-5 text-xl font-bold text-gray-800">
              Verifying Payment
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Please wait while we confirm your payment.
            </p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
              ✓
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-800">
              Payment Successful
            </h1>

            <p className="mt-2 text-sm text-gray-600">{message}</p>

            {reference && (
              <p className="mt-3 break-all text-xs text-gray-400">
                Reference: {reference}
              </p>
            )}

            <button
              type="button"
              onClick={handleContinue}
              className="mt-6 w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              View Subscription
            </button>
          </>
        )}

        {/* Failed */}
        {status === "failed" && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-600">
              !
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-800">
              Payment Not Completed
            </h1>

            <p className="mt-2 text-sm text-gray-600">{message}</p>

            {reference && (
              <p className="mt-3 break-all text-xs text-gray-400">
                Reference: {reference}
              </p>
            )}

            <button
              type="button"
              onClick={handleContinue}
              className="mt-6 w-full rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Back to Subscription
            </button>
          </>
        )}

        {/* Error */}
        {status === "error" && (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-600">
              !
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-800">
              Payment Error
            </h1>

            <p className="mt-2 text-sm text-gray-600">{message}</p>

            <button
              type="button"
              onClick={handleContinue}
              className="mt-6 w-full rounded-lg bg-gray-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
            >
              Back to Subscription
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default PaymentCallback;
