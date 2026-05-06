import { useState } from "react";
import { convertToCurrency, ozInGrams } from "./App";

const FormType3 = ({ className, weight, setWeight, spot, setSpot }) => {
  const buyBack = spot * weight;

  return (
    <section className={className}>
      <h1>Selling Calculator</h1>
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
            pattern="[0-9]*"
          />
        </div>
      </div>
      <div className="result">
        <div>
          <p className="mb-0">
            <b className="paid">
              ${weight && spot ? `${convertToCurrency(buyBack)}` : "0.00"}
              <br />
            </b>
          </p>
          <p className="muted">
            <b>Pay</b> @ ${spot ? convertToCurrency(spot / ozInGrams) : "0.00"}
            /gram
          </p>
        </div>
      </div>
    </section>
  );
};

export default FormType3;
