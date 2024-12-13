import calculatorIcon from "./assets/icon-calculator.svg";
import illustrationEmpty from "./assets/illustration-empty.svg";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FormattedNumber } from "react-intl";
import { useIntl } from "react-intl";

function App() {
  const [results, setResults] = useState({
    monthlyMortgage: 0,
    overAllMortgage: 0,
  });
  const [resultsExist, setResultsExist] = useState(false);

  const { formatNumber } = useIntl();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const handleClearForm = () => {
    reset();
    setResults({ monthlyMortgage: 0, overAllMortgage: 0 });
    setResultsExist(false);
  };

  const removeNonNumeric = (value) => value.replace(/[^0-9.]/g, "");

  const acceptOnlyNumberInput = (e, inputName) =>
    setValue(inputName, removeNonNumeric(e.target.value));

  const handleAmountFormat = (e) => {
    const number = removeNonNumeric(e.target.value);
    const value = +number.replace(/,/g, "");
    const formattedValue = formatNumber(value);
    setValue("amount", formattedValue);
  };

  const deformatAmount = (amount) => {
    return +amount.replace(/,/g, "");
  };

  const calculateMonthlyPayments = (loanPrincipal, interestRate, term) => {
    const monthlyInterestRate = interestRate / 100 / 12;
    const numOfPayments = term * 12;
    return (
      (loanPrincipal *
        monthlyInterestRate *
        (1 + monthlyInterestRate) ** numOfPayments) /
      ((1 + monthlyInterestRate) ** numOfPayments - 1)
    );
  };

  const calculateTotalAmountToPay = (monthlyAmount, term) => {
    return monthlyAmount * 12 * term;
  };

  const onSubmit = (data) => {
    console.log(data);
    const monthlyAmount = calculateMonthlyPayments(
      +deformatAmount(data?.amount),
      +data?.interest,
      +data?.term
    );

    const totalAmountToPay = calculateTotalAmountToPay(
      monthlyAmount,
      +data?.term
    );

    setResults({
      monthlyMortgage: monthlyAmount,
      overAllMortgage: totalAmountToPay,
    });
    setResultsExist(true);
  };

  return (
    <main className="w-full min-h-screen grid place-content-center sm:px-10 sm:bg-slate-100">
      <div className="w-full min-h-screen  sm:min-h-0 flex flex-col sm:bg-white sm:rounded-[24px] sm:overflow-hidden lg:flex-row lg:bg-white lg:w-[1008px] lg:max-w-[1008px] sm:shadow-[0px_32px_64px_0px_rgba(19,48,65,0.1)]">
        <div className="flex flex-col px-6 py-8 sm:p-10 flex-1">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-preset-2 text-slate-900">
              Mortgage Calculator
            </h1>
            <button
              className="text-preset-4 text-slate-700 hover:text-slate-900 underline"
              onClick={handleClearForm}
            >
              Clear All
            </button>
          </div>

          <form
            className="flex flex-col gap-6 mt-6 lg:mt-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Mortgage amount field  */}
            <div
              className={`w-full flex flex-col gap-3 ${
                errors?.amount && "error-group"
              }`}
            >
              <label htmlFor="amount" className="text-preset-4 text-slate-700">
                Mortgage Amount
              </label>
              <div className="h-[48px] w-full relative overflow-hidden rounded-[4px] border border-slate-500 hover:border-slate-900 input-focus">
                <span className="absolute top-0 left-0 bottom-0 z-10 px-4 py-[12.5px]  text-preset-3 text-slate-700 bg-slate-100">
                  £
                </span>
                <input
                  type="text"
                  id="amount"
                  className="absolute inset-0 focus:outline-none px-4 pl-14 py-[12.5px] text-preset-3 text-slate-900"
                  {...register("amount", {
                    required: "This field is required",
                    validate: (val) =>
                      (deformatAmount(val) >= 0 &&
                        deformatAmount(val) <= 100000000) ||
                      "Must be less than or equal to 100 Million",
                  })}
                  onChange={handleAmountFormat}
                />
              </div>
              {errors?.amount && (
                <p className="error">{errors?.amount?.message}</p>
              )}
            </div>

            <div className={`sm:flex sm:items-start sm:gap-6`}>
              {/* Mortgage term field  */}
              <div
                className={`w-full flex flex-col gap-3  ${
                  errors?.term && "error-group"
                }`}
              >
                <label htmlFor="term" className="text-preset-4 text-slate-700">
                  Mortgage Term
                </label>
                <div className="h-[48px] w-full relative overflow-hidden rounded-[4px] border border-slate-500 input-focus">
                  <input
                    type="text"
                    id="term"
                    className="absolute inset-0 focus:outline-none px-4 pr-24 py-[12.5px] text-preset-3 text-slate-900"
                    {...register("term", {
                      required: "This field is required",
                      validate: (val) =>
                        (val >= 0 && val <= 150) || "Must be between 1 to 150",
                    })}
                    onChange={(e) => acceptOnlyNumberInput(e, "term")}
                  />
                  <span className="absolute top-0 right-0 bottom-0 z-10 px-4 py-[12.5px]  text-preset-3 text-slate-700 bg-slate-100">
                    years
                  </span>
                </div>
                {errors?.term && (
                  <p className="error">{errors?.term?.message}</p>
                )}
              </div>

              {/* Interest Rate field  */}
              <div
                className={`w-full flex flex-col gap-3 ${
                  errors?.interest && "error-group"
                }`}
              >
                <label
                  htmlFor="interest"
                  className="text-preset-4 text-slate-700"
                >
                  Interest Rate
                </label>
                <div className="h-[48px] w-full relative overflow-hidden rounded-[4px] border border-slate-500 input-focus">
                  <input
                    type="text"
                    id="interest"
                    className="absolute inset-0 focus:outline-none px-4 pr-[67px] py-[12.5px] text-preset-3 text-slate-900"
                    {...register("interest", {
                      required: "This field is required",
                      validate: (val) =>
                        (val >= 0 && val <= 100) || "Must be between 1 to 100",
                    })}
                    onChange={(e) => acceptOnlyNumberInput(e, "interest")}
                  />
                  <span className="absolute top-0 right-0 bottom-0 z-10 px-4 py-[12.5px]  text-preset-3 text-slate-700 bg-slate-100">
                    %
                  </span>
                </div>
                {errors?.interest && (
                  <p className="error">{errors?.interest?.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-preset-4 text-slate-700">
                Mortgage Type
              </span>
              <label className="flex items-center gap-4 px-4 py-3 border border-slate-500 rounded-[4px] radio-group hover:border-lime cursor-pointer">
                <input
                  type="radio"
                  id="repaymentType"
                  className="hidden"
                  value="Repayment"
                  {...register("mortgageType", {
                    required: "This field is required",
                  })}
                />
                <label htmlFor="repaymentType" className="custom-radio"></label>

                <p className="text-preset-3 text-slate-900">Repayment</p>
              </label>
              <label
                className="flex items-center gap-4 px-4 py-3 border border-slate-500 rounded-[4px]  radio-group"
                htmlFor="interestType"
              >
                <input
                  type="radio"
                  id="interestType"
                  value="Interest Only"
                  className="hidden "
                  {...register("mortgageType", {
                    required: "This field is required",
                  })}
                />
                <label htmlFor="interestType" className="custom-radio"></label>
                <p className="text-preset-3 text-slate-900">Interest Only</p>
              </label>
              {errors?.mortgageType && (
                <p className="error">{errors?.mortgageType?.message}</p>
              )}
            </div>

            <button className="flex items-center w-full rounded-full p-4 gap-3  text-preset-3 justify-center btn-primary sm:max-w-[314px] lg:mt-4">
              <span className="flex-shrink-0">
                <img src={calculatorIcon} alt="calculator icon" />
              </span>
              Calculate Repayments
            </button>
          </form>
        </div>

        {resultsExist ? <Results results={results} /> : <EmptyResults />}
      </div>
    </main>
  );
}

const Results = ({ results }) => {
  return (
    <div className="px-6 py-8 sm:p-10 bg-slate-900 flex flex-col gap-4 items-start   flex-1 lg:rounded-bl-[80px]">
      <div className="flex items-start flex-col gap-10">
        <div className="flex flex-col gap-4">
          <h2 className="text-preset-2 text-white">Your results</h2>
          <p className="text-preset-4 text-slate-300">
            Your results are shown below based on the information you provided.
            To adjust the results, edit the form and click “calculate
            repayments” again.
          </p>
        </div>
        <div className="rounded-[8px] border-t-[4px] border-t-[#d8db2f] p-8 bg-black/25 flex flex-col gap-8 self-stretch">
          <div className="flex flex-col items-start gap-2">
            <h2 className="text-preset-4 text-slate-300">
              Your monthly repayments
            </h2>
            <p className="text-preset-1-desktop text-[#d8db2f]">
              <FormattedNumber
                value={results?.monthlyMortgage}
                style="currency"
                currency="GBP"
              />
            </p>
          </div>
          <hr className="h-[1px] bg-[#9abed540] self-stretch" />
          <div className="flex flex-col gap-2 items-start">
            <h2 className="text-preset-4 text-slate-300">
              Total you'll repay over the term
            </h2>
            <p className="text-preset-2 text-white">
              <FormattedNumber
                value={results?.overAllMortgage}
                style="currency"
                currency="GBP"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyResults = () => {
  return (
    <div className="px-6 py-8 sm:p-10 bg-slate-900 flex flex-col gap-4 items-center  justify-center flex-1 lg:rounded-bl-[80px]">
      <img src={illustrationEmpty} alt="Empty Illustration" />
      <div className="flex flex-col text-center gap-4">
        <h3 className="text-preset-2 text-white">Results shown here</h3>
        <p className="text-preset-4 text-slate-300">
          Complete the form and click “calculate repayments” to see what your
          monthly repayments would be.
        </p>
      </div>
    </div>
  );
};

export default App;
