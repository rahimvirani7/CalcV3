import { useState } from "react";
import { convertToCurrency } from "./App";
import { Checkbox, Button } from "@mui/material";
import PanToolAltIcon from "@mui/icons-material/PanToolAlt";

/**
 * Work out every dollar figure the auction tab needs from the raw inputs.
 *
 * The "coin spot" (spot price x weight) is what the coin is actually worth.
 * An auction house quotes that total as: bid + buyer's premium + other expenses.
 * So to recover the underlying bid we strip the expenses off the coin spot first,
 * then divide out the premium (because premium is charged ON TOP of the bid):
 *
 *     coinSpot = bid + bid * premiumRate + otherExpenses
 *     bid      = (coinSpot - otherExpenses) / (1 + premiumRate)
 *
 * The custom-bid section runs the same math forward: given a bid the user types,
 * the premium is simply bid * premiumRate.
 */
const getAuctionNumbers = ({
  spot,
  weight,
  buyerPremiumPercentage,
  otherExpenses,
  customBidValue,
}) => {
  // Coerce the raw expenses input into a number for safe arithmetic
  const expenses = Number(otherExpenses);
  // Convert the whole-number percentage (e.g. 22) into a rate (0.22)
  const premiumRate = Number(buyerPremiumPercentage) / 100;

  // --- Suggested bid, derived from the coin's true value ---
  // The coin's actual worth: spot price times weight
  const coinSpot = spot * weight;
  // Strip expenses off, then divide out the premium to recover the bare bid
  const suggestedBid = Number(
    ((coinSpot - expenses) / (premiumRate + 1)).toFixed(2),
  );
  // The premium charged on top of that suggested bid
  const suggestedPremium = Number((suggestedBid * premiumRate).toFixed(2));
  // Fees shown to the user bundle the premium together with other expenses
  const suggestedFees = suggestedPremium + expenses;

  // --- Custom bid, driven by whatever the user types ---
  // Coerce the user's typed bid into a number
  const customBid = Number(customBidValue);
  // The premium charged on top of the user's custom bid
  const customPremium = Number((customBid * premiumRate).toFixed(2));
  // Same fee bundle as above: premium plus other expenses
  const customFees = customPremium + expenses;

  // Expose the raw figures plus each section's fees and grand total
  return {
    expenses,
    suggestedBid,
    suggestedFees,
    // Grand total a bidder actually pays for the suggested bid
    suggestedTotal: suggestedBid + suggestedFees,
    customBid,
    customFees,
    // Grand total a bidder actually pays for their custom bid
    customTotal: customBid + customFees,
  };
};

/** Renders one "bid + fees = total" summary line used by both sections. */
const BreakdownLine = ({ bid, fees, total, bidClassName, caption, testId }) => (
  <div data-testid={testId}>
    <p className="mb-0">
      <b className="value">
        <span className={bidClassName} data-testid={`${testId}-bid`}>
          {`$${convertToCurrency(bid)}`}
        </span>
        &nbsp;+&nbsp;
        <span data-testid={`${testId}-fees`}>
          {`$${convertToCurrency(fees)}`}
        </span>
        &nbsp;=&nbsp;
        <span className="keep-together" data-testid={`${testId}-total`}>
          {`$${convertToCurrency(total)}`}
        </span>
        <span className="muted mt-0 mb-0">{caption}</span>
      </b>
    </p>
  </div>
);

const AuctionBidForm = ({ className, spot, weight, setWeight, onShowInBuying }) => {
  const [buyerPremiumPercentage, setBuyerPremiumPercentage] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);
  const [showCustomBid, setShowCustomBid] = useState(false);
  const [customBidValue, setCustomBidValue] = useState(0);

  // All dollar math lives in one place so the JSX below stays presentational
  const {
    suggestedBid,
    suggestedFees,
    suggestedTotal,
    customBid,
    customFees,
    customTotal,
  } = getAuctionNumbers({
    spot,
    weight,
    buyerPremiumPercentage,
    otherExpenses,
    customBidValue,
  });

  // Nothing is meaningful until we know both the spot price and the weight
  const hasSpotAndWeight = Boolean(weight && spot);
  const showCustomResult = Boolean(customBidValue) && buyerPremiumPercentage > 0;

  return (
    <section className={className} data-testid="auction-bid-form">
      <h1>Auction Bid Calculator</h1>

      {/* ---- Inputs: weight, premium %, and any extra expenses ---- */}
      <div className="form" data-testid="auction-inputs">
        <div className="inputGroup">
          <div className="label">Gold Weight (oz.)</div>
          <input
            value={weight ?? ""}
            onChange={(e) => setWeight(e.target.value)}
            type="number"
            data-testid="auction-weight-input"
          />
        </div>

        <div className="inputGroup">
          <div className="label">Buyer's Premium %</div>
          <div className={`percentInput ${buyerPremiumPercentage ? "hasValue" : ""}`}>
            <input
              onChange={(e) => setBuyerPremiumPercentage(e.target.value)}
              type="number"
              data-testid="auction-premium-input"
            />
          </div>
        </div>

        <div className="inputGroup">
          <div className="label">Other Expenses</div>
          <div className={`moneyInput ${otherExpenses ? "hasValue" : ""}`}>
            <input
              onChange={(e) => setOtherExpenses(e.target.value)}
              type="number"
              data-testid="auction-expenses-input"
            />
          </div>
        </div>
      </div>

      {/* ---- Suggested bid: how high you can bid and still break even ---- */}
      <div className="result mb-2">
        <BreakdownLine
          testId="auction-suggested-result"
          bid={hasSpotAndWeight ? suggestedBid : 0}
          fees={suggestedFees}
          total={suggestedTotal}
          bidClassName="bidAmount"
          caption={
            <>
              <span className="bidAmount">bid amount</span> + fees = coin spot
            </>
          }
        />
      </div>

      {/* ---- Optional custom bid: what a bid you type actually costs ---- */}
      <div className="form" data-testid="auction-custom-bid-section">
        <Checkbox
          sx={{ p: 0, mr: 2 }}
          size="small"
          color="error"
          checked={showCustomBid}
          onChange={(e) => setShowCustomBid(e.target.checked)}
          data-testid="auction-custom-bid-toggle"
        />
        {showCustomBid && (
          <>
            <div className="inputGroup">
              <div className="label">Custom Bid</div>
              <div className={`moneyInput ${customBidValue ? "hasValue" : ""}`}>
                <input
                  onChange={(e) => setCustomBidValue(e.target.value)}
                  type="number"
                  data-testid="auction-custom-bid-input"
                />
              </div>
            </div>

            {showCustomResult ? (
              <div className="result text-center">
                <BreakdownLine
                  testId="auction-custom-result"
                  bid={hasSpotAndWeight ? customBid : 0}
                  fees={customFees}
                  total={customTotal}
                  caption="custom bid + fees = total paying"
                />
                <Button
                  sx={{ textTransform: "lowercase" }}
                  className="btn-copy"
                  endIcon={<PanToolAltIcon />}
                  onClick={() => onShowInBuying(customTotal)}
                  data-testid="auction-show-in-buying-btn"
                >
                  show in buying
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
};

export default AuctionBidForm;
