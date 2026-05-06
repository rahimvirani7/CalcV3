import { convertToCurrency, ozInGrams } from "./App";

const FormType1 = ({
  className,
  weight,
  setWeight,
  purity,
  setPurity,
  spot,
  setSpot,
  onCopyWeight,
}) => {
  const pmWeight = parseFloat(weight * purity).toFixed(4);

  return (
    <section className={className}>
      <h1>Metal Value Calculator</h1>
      <div className="form">
        <div className="inputGroup">
          <div className="label">Gram Weight</div>
          <input
            onChange={(e) => setWeight(e.target.value / ozInGrams)}
            type="number"
          />
        </div>
        <div className="inputGroup">
          <div className="label">Metal Purity (0.xx)</div>
          <input type="number" onChange={(e) => setPurity(e.target.value)} />
        </div>
        <div className="inputGroup">
          <div className="label">Metal Spot ($/oz.)</div>
          <input
            type="number"
            onChange={(e) => setSpot(e.target.value)}
            value={spot}
          />
        </div>
      </div>
      <div className="result">
        <p>
          Metal Value is{" "}
          <b className="value">${convertToCurrency(pmWeight * spot)}</b>
          <span className="muted">
            @ ${convertToCurrency(spot / ozInGrams)}/gram
          </span>
        </p>
        <p className="mb-0">
          Metal Weight is <b className="weight">{pmWeight}</b> oz.
        </p>
        <button className="btn-copy" onClick={onCopyWeight}>
          copy over
        </button>{" "}
        {/* Add Copy button */}
      </div>
    </section>
  );
};

export default FormType1;
