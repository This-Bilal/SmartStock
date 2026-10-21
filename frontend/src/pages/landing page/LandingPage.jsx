import {
  FiArrowRight,
  FiBarChart2,
  FiBox,
  FiCheck,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTitle } from "../../hooks/useTitile";

const features = [
  {
    icon: FiBox,
    title: "Inventory you can trust",
    description:
      "Keep products, stock levels, and adjustments organized in one place.",
  },
  {
    icon: FiTrendingUp,
    title: "Sales with more clarity",
    description:
      "Stay on top of sales activity and understand how your business is doing.",
  },
  {
    icon: FiUsers,
    title: "A team that stays in sync",
    description:
      "Give your team the tools they need with roles built around their work.",
  },
  {
    icon: FiBarChart2,
    title: "Insights for better decisions",
    description: "Turn everyday business activity into reports you can act on.",
  },
];

const LandingPage = () => {
  useTitle("SmartStock: Inventory made easy");

  return (
    <main className="overflow-hidden bg-white text-gray-900">
      <section className="relative bg-red-50">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-red-700 shadow-sm sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              INVENTORY, WITHOUT THE GUESSWORK
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Run your stock.
              <span className="block text-red-600">Grow with confidence.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8 lg:mx-0">
              Bring inventory, sales, and your team together in one simple
              workspace—so you can spend less time keeping track and more time
              moving your business forward.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              >
                Get started for free
                <FiArrowRight aria-hidden="true" />
              </Link>
              <Link
                to="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
              >
                Sign in
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-600 lg:justify-start">
              {["Inventory", "Sales", "Team"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <FiCheck
                    aria-hidden="true"
                    className="text-red-600"
                    size={16}
                  />
                  {item} in one place
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white p-2 shadow-2xl shadow-gray-900/10 sm:p-3">
              <img
                src="/download.jpg"
                alt="Business owner reviewing business growth"
                className="aspect-4/3 w-full rounded-xl object-cover object-center"
              />
              <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/70 bg-white/95 p-4 shadow-lg backdrop-blur sm:bottom-8 sm:left-8 sm:right-8 sm:p-5">
                <p className="text-sm font-semibold text-gray-900">
                  Your business, in better focus
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Keep the details organized and make your next move with
                  confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how"
        aria-labelledby="features-heading"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
            Everything working together
          </p>
          <h2
            id="features-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl"
          >
            A simpler way to run your business
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Get the essentials in one place, with less busywork between them.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg hover:shadow-gray-900/5"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <Icon aria-hidden="true" size={21} />
              </span>
              <h3 className="mt-5 text-base font-semibold text-gray-900">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 rounded-2xl bg-gray-950 px-6 py-10 text-center sm:px-10 sm:py-12 lg:flex-row lg:px-14 lg:text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-red-300">
              Start with a clearer picture
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready to make stock management simpler?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
              Set up your SmartStock account and bring your day-to-day
              operations together.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Create your account
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
