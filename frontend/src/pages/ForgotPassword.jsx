import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTitle } from "../hooks/useTitile";
import { requestPasswordReset } from "../services/authService";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
  useTitle("Forgot your password");

  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("employee");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setSubmitted(false);

    try {
      const response = await requestPasswordReset(
        normalizedEmail,
        accountType,
      );
      setSubmitted(true);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message || "Unable to process your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-red-50 px-4 py-12">
      <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="text-center text-2xl font-semibold text-gray-900">
          Forgot your password?
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Enter your email and account type to request a password reset.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="reset-email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
              placeholder="Enter your email"
            />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-gray-700">
              Account type
            </legend>
            <div className="flex gap-6">
              {["owner", "employee"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 text-sm capitalize text-gray-700"
                >
                  <input
                    type="radio"
                    name="accountType"
                    value={type}
                    checked={accountType === type}
                    onChange={(event) => setAccountType(event.target.value)}
                    className="accent-red-500"
                  />
                  {type}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-500 py-2.5 text-sm text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending request..." : "Send reset link"}
          </button>
        </form>

        {submitted && (
          <p
            className="mt-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-800"
            role="status"
          >
            If an account matches those details, a password reset link will be
            sent.
          </p>
        )}

        <p className="mt-5 text-center text-sm">
          <Link to="/login" className="text-red-600 hover:underline">
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;
