import { useState } from "react";
import { convertToCurrency } from "./App";
import { Checkbox, Button } from "@mui/material";
import PanToolAltIcon from "@mui/icons-material/PanToolAlt";

const AuctionBidForm = ({
  className,
  spot,
  weight,
  setWeight,
  onShowInBuying,
}) => {
  const [buyerPremiumPercentage, setBuyerPremiumPercentage] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);
  const [showCustomBid, setShowCustomBid] = useState(false);
  const [customBidValue, setCustomBidValue] = useState(0);

  const coinSpot = spot * weight;
  const premiumRate = Number(buyerPremiumPercentage) / 100;
  const premiumDenominator = premiumRate + 1;
  // Remove other expenses from coin spot *before* splitting out the premium, so the premium is calculated on the true bid
  const bidAmount = Number(
    ((coinSpot - Number(otherExpenses)) / premiumDenominator).toFixed(2),
  );
  const premiumAmount = Number((bidAmount * premiumRate).toFixed(2));
  const customBidPremium = Number(
    customBidValue / buyerPremiumPercentage,
  ).toFixed(2);
  const totalPaying =
    Number(customBidValue) + Number(otherExpenses) + Number(customBidPremium);

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

      <div className="result mb-2">
        <div>
          <p className="mb-0">
            <b className="value">
              <span className="bidAmount">
                {weight && spot ? `$${convertToCurrency(bidAmount)}` : "$0.00"}
              </span>
              &nbsp;+&nbsp;
              {`$${convertToCurrency(premiumAmount + Number(otherExpenses))}`}
              &nbsp;=&nbsp;
              <span className="keep-together">{`$${convertToCurrency(bidAmount + Number(otherExpenses) + premiumAmount)}`}</span>
              <span className="muted mt-0 mb-0">
                <span className="bidAmount">bid amount</span> + fees = coin spot
              </span>
            </b>
          </p>
        </div>
      </div>

      <div className="form">
        <Checkbox
          sx={{ p: 0, mr: 2 }}
          size="small"
          color="error"
          checked={showCustomBid}
          onChange={(e) => {
            setShowCustomBid(e.target.checked);
          }}
        />
        {showCustomBid && (
          <>
            <div className="inputGroup">
              <div className="label">Custom Bid</div>
              <div className={`moneyInput ${customBidValue ? "hasValue" : ""}`}>
                <input
                  onChange={(e) => setCustomBidValue(e.target.value)}
                  type="number"
                />
              </div>
            </div>
            {customBidValue && buyerPremiumPercentage > 0 ? (
              <div className="result text-center">
                <div>
                  <p>
                    <b className="value">
                      <span>
                        {weight && spot
                          ? `$${convertToCurrency(customBidValue)}`
                          : "$0.00"}
                      </span>
                      &nbsp;+&nbsp;
                      {`$${convertToCurrency(Number(customBidPremium) + Number(otherExpenses))}`}
                      &nbsp;=&nbsp;
                      <span className="keep-together">{`$${convertToCurrency(totalPaying)}`}</span>
                      <span className="muted mt-0 mb-0">
                        custom bid + fees = total paying
                      </span>
                    </b>
                  </p>
                </div>
                <Button
                  sx={{ textTransform: "lowercase" }}
                  className="btn-copy"
                  endIcon={<PanToolAltIcon />}
                  onClick={() => onShowInBuying(totalPaying)}
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
