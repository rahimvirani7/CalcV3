import { useState } from "react";
import { convertToCurrency } from "./App";

const AuctionBidForm = ({ className, spot, weight, setWeight }) => {
  const [buyerPremiumPercentage, setBuyerPremiumPercentage] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);
  const coinSpot = spot * weight;
  const premiumDenominator = Number(buyerPremiumPercentage) / 100 + 1;
  const premiumAmount = Number(
    (coinSpot - coinSpot / premiumDenominator).toFixed(2),
  );
  const bidAmount = Number(
    (coinSpot / premiumDenominator - Number(otherExpenses)).toFixed(2),
  );

  return (
    <section className={className}>
      <h1>Auction Bid Calculator</h1>
      <div className="form">
        <div className="inputGroup">
          <div className="label">Gold Weight (oz.)</div>
          <input
            value={weight ?? ""}
            onChange={(e) => {
              setWeight(e.target.value); // Update with raw number
            }}
            type="number"
          />
        </div>

        <div className="inputGroup">
          <div className="label">Buyer's Premium %</div>
          <div
            className={`percentInput ${buyerPremiumPercentage ? "hasValue" : ""}`}
          >
            <input
              onChange={(e) => setBuyerPremiumPercentage(e.target.value)}
              type="number"
            />
          </div>
        </div>

        <div className="inputGroup">
          <div className="label">Other Expenses</div>
          <div className={`moneyInput ${otherExpenses ? "hasValue" : ""}`}>
            <input
              onChange={(e) => setOtherExpenses(e.target.value)}
              type="number"
            />
          </div>
        </div>
      </div>

      <div className="result">
        <div>
          <p className="mb-0">
            <b className="value">
              <span className="bidAmount">
                {weight && spot ? `$${convertToCurrency(bidAmount)}` : "$0.00"}
              </span>
              &nbsp;+&nbsp;
              {`$${convertToCurrency(premiumAmount + Number(otherExpenses))}`}
              &nbsp;=&nbsp;
              {`$${convertToCurrency(bidAmount + Number(otherExpenses) + premiumAmount)}`}
              <span className="muted mt-0 mb-0">
                <span className="bidAmount">bid amount</span> + fees = coin spot
              </span>
            </b>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuctionBidForm;
