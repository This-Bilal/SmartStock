import React, { useEffect, useState } from "react";
import {
  getCurrentSubscription,
  cancelCurrentSubscription,
} from "../../services/subscriptionService";
import {
  getPaymentByReference,
  initializePayment,
} from "../../services/paymentService";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { useTitle } from "../../hooks/useTitile";
import { toast, Toaster } from "sonner";
import CancelSubscriptionModal from "./component/CancelSubscriptionModal";
import ChangeSubscriptionModal from "./component/ChangeSubscriptionModal";

const SubscriptionPage = () => {
  useTitle("SubscriptionPage");

  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/ownerprofile");
  };

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);

        const data = await getCurrentSubscription();

        setSubscription(data.subscription);
        setPlans(data.plans);
      } catch (error) {
        toast.error(error?.message || "Failed to load subscription.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  // Check payment status whenever the user
  // returns to the SmartStock page.
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const storedPayment = sessionStorage.getItem("smartstock_payment");

      if (!storedPayment) {
        setProcessingPlan("");
        return;
      }

      try {
        const payment = JSON.parse(storedPayment);

        setProcessingPlan("");

        if (!payment?.reference) {
          sessionStorage.removeItem("smartstock_payment");
          return;
        }

        const response = await getPaymentByReference(payment.reference);

        const paymentStatus = response?.payment?.status;

        // Successful payment
        if (paymentStatus === "success") {
          sessionStorage.removeItem("smartstock_payment");

          const data = await getCurrentSubscription();

          setSubscription(data.subscription);
          setPlans(data.plans);

          toast.success("Subscription activated successfully.");

          return;
        }

        // Failed payment
        if (paymentStatus === "failed") {
          sessionStorage.removeItem("smartstock_payment");

          toast.error("Your payment was not completed. You can try again.");

          return;
        }

        // Pending payment
        // Keep the reference so it can still be checked later.
      } catch (error) {
        setProcessingPlan("");
      }
    };

    const handlePageShow = () => {
      checkPaymentStatus();
    };

    window.addEventListener("pageshow", handlePageShow);

    checkPaymentStatus();

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  // Initialize Paystack payment
  const handleSubscribe = async (plan) => {
    try {
      setProcessingPlan(plan);

      const response = await initializePayment(plan);

      sessionStorage.setItem(
        "smartstock_payment",
        JSON.stringify({
          reference: response.payment.reference,
          plan,
        }),
      );

      window.location.href = response.authorizationUrl;
    } catch (error) {
      toast.error(error?.message || "Failed to initialize payment.");

      setProcessingPlan("");
    }
  };

  // Decide whether to show the change-plan modal
  // before starting a new paid subscription.
  const handlePlanSelection = (plan) => {
    const hasActivePaidPlan =
      subscription &&
      subscription.plan !== "free" &&
      subscription.status === "active";

    if (hasActivePaidPlan) {
      setSelectedPlan(plan);
      setShowChangeModal(true);

      return;
    }

    handleSubscribe(plan);
  };

  // User confirmed that they want to replace
  // their current paid subscription.
  const handleConfirmPlanChange = () => {
    if (!selectedPlan) {
      return;
    }

    setShowChangeModal(false);

    const plan = selectedPlan;

    setSelectedPlan("");

    handleSubscribe(plan);
  };

  // User chose not to change their plan.
  const handleCloseChangeModal = () => {
    setShowChangeModal(false);
    setSelectedPlan("");
  };

  const handleCancelSubscription = async () => {
    try {
      setCancelling(true);

      const response = await cancelCurrentSubscription();

      setSubscription(response.subscription);

      setShowCancelModal(false);

      toast.success(response.message || "Subscription cancelled successfully.");
    } catch (error) {
      toast.error(error?.message || "Failed to cancel subscription.");
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-NG", {
      timeZone: "Africa/Lagos",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG").format(price);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-red-50 px-4 sm:px-6 lg:px-10">
        <div className="flex w-full max-w-7xl flex-col items-center justify-center rounded-2xl bg-white p-4 py-10 shadow-md sm:p-5 lg:p-6">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent sm:h-12 sm:w-12"></div>

          <p className="mt-3 text-xs text-gray-500 sm:text-sm">
            Loading plans...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-red-50">
      <Toaster position="top-right" richColors />

      {/* KEEP ORIGINAL SIDE SPACING */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        {/* BACK BUTTON */}
        <button
          onClick={handleHome}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors duration-200 hover:cursor-pointer hover:text-gray-800 sm:text-sm md:text-base"
        >
          <MdArrowBack className="text-base sm:text-lg" />
          Back
        </button>

        {/* HEADER */}
        <div className="mb-7 sm:mb-8 md:mb-10">
          <h1 className="text-2xl font-bold leading-tight text-gray-800 sm:text-3xl md:text-4xl">
            Subscription
          </h1>

          <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base">
            Manage your SmartStock subscription plan.
          </p>
        </div>

        {/* CURRENT SUBSCRIPTION */}
        {subscription && (
          <section className="mb-7 rounded-xl bg-white p-4 shadow-sm sm:mb-8 sm:p-5 md:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 sm:text-sm">Current Plan</p>

                <h2 className="mt-1 text-lg font-bold capitalize text-gray-800 sm:text-xl md:text-2xl">
                  {subscription.limits?.name || subscription.plan}
                </h2>
              </div>

              <div className="shrink-0">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize sm:px-3 sm:py-1 sm:text-sm ${
                    subscription.status === "active"
                      ? "bg-green-100 text-green-700"
                      : subscription.status === "cancelled"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {subscription.status}
                </span>
              </div>
            </div>

            {subscription.endDate && (
              <p className="mt-4 text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base">
                {subscription.status === "cancelled"
                  ? "Access ends on"
                  : "Plan ends on"}{" "}
                <span className="font-medium text-gray-800">
                  {formatDate(subscription.endDate)}
                </span>
              </p>
            )}

            {/* CANCEL PLAN */}
            {subscription.plan !== "free" &&
              subscription.status === "active" && (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  disabled={cancelling}
                  className="mt-5 w-full rounded-lg bg-red-50 px-4 py-2.5 text-xs font-medium text-red-600 transition-colors duration-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-sm md:px-5 md:py-3"
                >
                  {cancelling ? "Cancelling..." : "Cancel Plan"}
                </button>
              )}
          </section>
        )}

        {/* PLANS */}
        <section>
          <div className="mb-5 sm:mb-6">
            <h2 className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">
              Available Plans
            </h2>

            <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base">
              Choose the plan that fits your business needs.
            </p>
          </div>

          {plans.length === 0 ? (
            <div className="rounded-xl bg-white p-5 text-center shadow-sm sm:p-6 md:p-7">
              <p className="text-xs text-gray-600 sm:text-sm md:text-base">
                No subscription plans are currently available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {plans.map((plan) => {
                const isCurrentPlan = subscription?.plan === plan.id;

                const isProcessing = processingPlan === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={`flex h-full min-w-0 flex-col rounded-xl bg-white p-4 shadow-sm sm:p-5 md:p-6 ${
                      isCurrentPlan ? "ring-2 ring-red-500" : ""
                    }`}
                  >
                    {/* PLAN HEADER */}
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <h3 className="min-w-0 wrap-break-word text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">
                        {plan.name}
                      </h3>

                      {isCurrentPlan && (
                        <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-[10px] font-medium text-green-600 sm:px-2.5 sm:text-xs">
                          Current
                        </span>
                      )}
                    </div>

                    {/* PRICE */}
                    <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                      {plan.price === 0
                        ? "Free"
                        : `₦${formatPrice(plan.price)}`}

                      {plan.price > 0 && (
                        <span className="text-xs font-normal text-gray-500 sm:text-sm">
                          {" "}
                          / month
                        </span>
                      )}
                    </p>

                    {/* DESCRIPTION */}
                    <p className="mt-3 min-h-0 text-xs leading-relaxed text-gray-600 sm:min-h-10 sm:text-sm md:text-[15px]">
                      {plan.description}
                    </p>

                    {/* PLAN LIMITS */}
                    <div className="mt-5 flex-1 space-y-3 border-t border-gray-100 pt-5 sm:mt-6">
                      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm md:text-[15px]">
                        <span className="text-gray-600">Products</span>

                        <span className="text-right font-medium text-gray-800">
                          {plan.limits?.maxProducts}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm md:text-[15px]">
                        <span className="text-gray-600">Employees</span>

                        <span className="text-right font-medium text-gray-800">
                          {plan.limits?.maxEmployees}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm md:text-[15px]">
                        <span className="text-gray-600">Advanced Reports</span>

                        <span
                          className={
                            plan.limits?.advancedReports
                              ? "text-right font-medium text-green-600"
                              : "text-right font-medium text-gray-400"
                          }
                        >
                          {plan.limits?.advancedReports
                            ? "Available"
                            : "Not available"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm md:text-[15px]">
                        <span className="text-gray-600">Sale Details</span>

                        <span
                          className={
                            plan.limits?.saleDetails
                              ? "text-right font-medium text-green-600"
                              : "text-right font-medium text-gray-400"
                          }
                        >
                          {plan.limits?.saleDetails
                            ? "Available"
                            : "Not available"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm md:text-[15px]">
                        <span className="text-gray-600">Inventory History</span>

                        <span
                          className={
                            plan.limits?.inventoryHistory
                              ? "text-right font-medium text-green-600"
                              : "text-right font-medium text-gray-400"
                          }
                        >
                          {plan.limits?.inventoryHistory
                            ? "Available"
                            : "Not available"}
                        </span>
                      </div>
                    </div>

                    {/* ACTION */}
                    {plan.id !== "free" && !isCurrentPlan && (
                      <button
                        type="button"
                        onClick={() => handlePlanSelection(plan.id)}
                        disabled={isProcessing}
                        className="mt-6 w-full rounded-lg bg-red-500 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:py-3 sm:text-sm md:text-[15px]"
                      >
                        {isProcessing
                          ? "Processing..."
                          : `Subscribe to ${plan.name}`}
                      </button>
                    )}

                    {isCurrentPlan && (
                      <div className="mt-6 w-full rounded-lg bg-gray-100 px-3 py-2.5 text-center text-xs font-semibold text-gray-600 sm:px-4 sm:py-3 sm:text-sm md:text-[15px]">
                        Current Plan
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* CANCEL SUBSCRIPTION MODAL */}
      {showCancelModal && (
        <CancelSubscriptionModal
          onClose={() => setShowCancelModal(false)}
          onContinue={handleCancelSubscription}
        />
      )}

      {/* CHANGE SUBSCRIPTION MODAL */}
      {showChangeModal && (
        <ChangeSubscriptionModal
          currentPlan={subscription?.limits?.name || subscription?.plan}
          newPlan={
            plans.find((plan) => plan.id === selectedPlan)?.name || selectedPlan
          }
          onClose={handleCloseChangeModal}
          onContinue={handleConfirmPlanChange}
        />
      )}
    </main>
  );
};

export default SubscriptionPage;
