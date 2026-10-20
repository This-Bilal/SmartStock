import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { toast } from "sonner";
import { useTitle } from "../hooks/useTitile";
import { resetPassword } from "../services/authService";

const TOKEN_PATTERN = /^[a-f0-9]{64}$/i;

const ResetPassword = () => {
  useTitle("Reset your password");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!TOKEN_PATTERN.test(token)) {
      toast.error("This password reset link is invalid or has expired.");
      return;
    }

    const passwordBytes = new TextEncoder().encode(password).length;
    if (
      Array.from(password).length < 8 ||
      Array.from(password).length > 72 ||
      passwordBytes > 72
    ) {
      toast.error("Password must be at least 8 characters and no more than 72 bytes.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(token, password);
      toast.success(response.message);
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error.message || "This password reset link is invalid or has expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordField = (id, label, value, onChange, visible, toggle) => (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          maxLength={72}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-11 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
          placeholder={label}
        />
        <button
          type="button"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-600"
        >
          {visible ? <IoMdEyeOff /> : <IoMdEye />}
        </button>
      </div>
    </div>
  );

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-red-50 px-4 py-12">
      <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="text-center text-2xl font-semibold text-gray-900">
          Reset your password
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Choose a new password for your SmartStock account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {passwordField(
            "new-password",
            "New password",
            password,
            setPassword,
            showPassword,
            () => setShowPassword((shown) => !shown),
          )}
          {passwordField(
            "confirm-password",
            "Confirm password",
            confirmPassword,
            setConfirmPassword,
            showConfirmPassword,
            () => setShowConfirmPassword((shown) => !shown),
          )}
          <p className="text-xs text-gray-500">
            Use at least 8 characters. Passwords may be up to 72 bytes.
          </p>
          <button
            type="submit"
            disabled={loading || !TOKEN_PATTERN.test(token)}
            className="w-full rounded-lg bg-red-500 py-2.5 text-sm text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Resetting password..." : "Reset password"}
          </button>
        </form>

        {!TOKEN_PATTERN.test(token) && (
          <p className="mt-4 text-center text-sm text-red-600" role="alert">
            This password reset link is invalid or incomplete.
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

export default ResetPassword;
