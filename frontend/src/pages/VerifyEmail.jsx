import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/authService";
import { useTitle } from "../hooks/useTitile";

const VerifyEmail = () => {
  useTitle("Verify your email");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your email address...");
  const [destination, setDestination] = useState("/login");
  const requestStarted = useRef(false);

  useEffect(() => {
    if (requestStarted.current) {
      return;
    }
    requestStarted.current = true;

    const token = searchParams.get("token");
    const accountType = searchParams.get("type");
    verifyEmail(accountType, token)
      .then((response) => {
        setStatus("success");
        setMessage(response.message);
        setDestination(
          response.role === "owner"
            ? "/ownerhomepage"
            : response.role === "manager"
              ? "/managerhomepage"
              : response.role === "cashier"
                ? "/cashierhomepage"
                : "/login",
        );
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error.message || "This verification link is invalid or expired.");
      });
  }, [searchParams]);

  useEffect(() => {
    if (status !== "success" || destination === "/login") {
      return undefined;
    }

    const timeout = window.setTimeout(
      () => navigate(destination, { replace: true }),
      1500,
    );

    return () => window.clearTimeout(timeout);
  }, [destination, navigate, status]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-red-50 px-4 py-12">
      <section className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-900">
          {status === "success" ? "Email verified" : "Verify your email"}
        </h1>
        <p className="mt-3 text-sm text-gray-600" role="status">
          {message}
        </p>
        {status !== "verifying" && (
          status === "success" ? (
            <button
              type="button"
              onClick={() => navigate(destination, { replace: true })}
              className="mt-6 inline-block rounded-lg bg-red-500 px-5 py-2 text-sm text-white hover:bg-red-600"
            >
              {destination === "/login" ? "Go to login" : "Continue to account"}
            </button>
          ) : (
            <Link
              to="/login"
              className="mt-6 inline-block rounded-lg bg-red-500 px-5 py-2 text-sm text-white hover:bg-red-600"
            >
              Go to login
            </Link>
          )
        )}
      </section>
    </main>
  );
};

export default VerifyEmail;
