import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resendVerificationEmail, verifyEmail } from "../services/authService";
import { useTitle } from "../hooks/useTitile";

const VerifyEmail = () => {
  useTitle("Verify your SmartStock email");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [status, setStatus] = useState(token ? "verifying" : "idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (!token || verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    verifyEmail(token)
      .then((response) => {
        setStatus("verified");
        setMessage(response.message);
      })
      .catch((error) => {
        setStatus("failed");
        setMessage(error.message || "Unable to verify this email address.");
      });
  }, [token]);

  const handleResend = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await resendVerificationEmail(email);
      setMessage(response.message);
      setStatus("sent");
    } catch (error) {
      setMessage(error.message || "Unable to send a verification email.");
      setStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-red-50 px-4 py-10">
      <section className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-lg sm:p-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Verify your email
        </h1>

        {status === "verifying" && (
          <p className="mt-3 text-sm text-gray-600">Verifying your email...</p>
        )}

        {(status === "verified" || status === "failed" || status === "sent") &&
          message && (
            <p
              role="status"
              className={`mt-3 text-sm ${
                status === "verified" || status === "sent"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {message}
            </p>
          )}

        {status !== "verified" && (
          <>
            <p className="mt-3 text-sm text-gray-600">
              Enter the address you registered with and we will send a new link if
              the account still needs verification.
            </p>
            <form onSubmit={handleResend} className="mt-5 text-left">
              <label
                htmlFor="verification-email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="verification-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-lg bg-red-500 px-4 py-2.5 text-sm text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Resend verification email"}
              </button>
            </form>
          </>
        )}

        {status === "verified" && (
          <Link
            to="/login"
            className="mt-5 inline-block text-sm font-medium text-red-600 hover:underline"
          >
            Go to login
          </Link>
        )}
      </section>
    </main>
  );
};

export default VerifyEmail;
