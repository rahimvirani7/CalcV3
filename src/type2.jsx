import { useState } from "react";
import { convertToCurrency, ozInGrams } from "./App";

const FormType2 = ({ className, weight, setWeight, spot, setSpot }) => {
  const [asking, setAsking] = useState(0);
  const coinSpot = spot * weight;
  const premium = asking - coinSpot;

  return (
    <section className={className}>
      <h1>Buying Calculator</h1>
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
          <div className="label">Spot ($/oz.)</div>
          <input
            onChange={(e) => setSpot(e.target.value)}
            value={spot}
            type="number"
          />
        </div>
        <div className="inputGroup">
          <div className="label">Asking $</div>
          <input onChange={(e) => setAsking(e.target.value)} type="number" />
        </div>
      </div>
      <div className="result">
        <div>
          <p className="mb-0">
            <b className="value">
              ${weight && spot ? `${convertToCurrency(coinSpot)}` : "0.00"}
              &nbsp;+&nbsp;
              {asking && coinSpot ? `$${convertToCurrency(premium)}` : "$??"}
              <br />
              <span className="muted mt-0 mb-0">(coin spot) + (premium)</span>
            </b>
          </p>
          <p className="muted">
            <b>Premium</b> @&nbsp;
            {asking && coinSpot
              ? `${((premium / coinSpot) * 100).toFixed(2)}`
              : "0"}
            %
          </p>
          <p className="muted">
            <b>Asking</b> @ $
            {asking && weight ? convertToCurrency(asking / weight) : "0.00"}
            /oz{" "}
            {asking > 0 &&
              weight &&
              "($" + convertToCurrency(asking / weight / ozInGrams) + "/gram)"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FormType2;
