import { useState } from "react";
import { convertToCurrency, ozInGrams } from "./App";
import PanToolAltIcon from "@mui/icons-material/PanToolAlt";
import { Button, Checkbox } from "@mui/material";

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
  const [enableSpotEdit, setEnableSpotEdit] = useState(false);

  return (
    <section className={className}>
      <h1>Value Calculator</h1>
      <div className="form">
        <div className="inputGroup">
          <div className="label">Gram Weight</div>
          <input
            onChange={(e) => setWeight(e.target.value / ozInGrams)}
            type="number"
          />
        </div>
        <div className="inputGroup">
          <div className="label">Purity (0.xx)</div>
          <input type="number" onChange={(e) => setPurity(e.target.value)} />
        </div>
        <div className="inputGroup">
          <Checkbox
            size="small"
            color="error"
            checked={enableSpotEdit}
            onChange={(e) => {
              setEnableSpotEdit(e.target.checked);
            }}
          />
          <div className="label">Spot ($/oz.)</div>
          <input
            type="number"
            disabled={!enableSpotEdit}
            onChange={(e) => setSpot(e.target.value)}
            value={spot}
          />
        </div>
      </div>
      <div className="result">
        <p>
          Value is{" "}
          <b className="value">${convertToCurrency(pmWeight * spot)}</b>
          <span className="muted">
            @ ${convertToCurrency(spot / ozInGrams)}/gram
          </span>
        </p>
        <p className="mb-0">
          AGW is <b className="weight">{pmWeight}</b> oz.
        </p>
        <Button
          sx={{ textTransform: "lowercase" }}
          className="btn-copy"
          endIcon={<PanToolAltIcon />}
          onClick={onCopyWeight}
        >
          copy over
        </Button>
      </div>
    </section>
  );
};

export default FormType1;
