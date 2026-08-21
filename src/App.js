import React, { useState, useEffect } from "react";
import "./assets/styles.css";
import "./assets/switch.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FormType1 from "./type1";
import FormType2 from "./type2";
import { styled } from "styled-components";
import FormType3 from "./type3";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import usdImage from "./assets/USD.png";
import cadImage from "./assets/CAD.png";

const DEFAULT_BUYBACK_PERCENT_VALUE = 0.975;
const BUYBACK_CONFIG_URL =
  "https://gist.githubusercontent.com/rahimvirani7/1b5e34aaf296b74529ee72a8991316a6/raw/gist_calc-v3.json";

export const convertToCurrency = (value) => {
  return Number(value)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const ozInGrams = 31.1035;

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const CustomTabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box sx={{ p: 2 }}>{children}</Box>
    </div>
  );
};

const CustomTab = styled(Tab)`
  font-family: "Noto Sans", sans-serif;
  font-size: 16px;
  padding: 12px;
  font-weight: 500;
  text-transform: inherit;
  color: #000;
  &.Mui-selected {
    font-weight: 600;
    color: #010f8d;
  }

  @media (max-width: 768px) {
    width: 33.33%;
  }

  /* dark mode overrides */
  .App.dark & {
    color: #f5f5f5;
  }

  .App.dark &.Mui-selected {
    color: #3794ff;
  }
`;

export default function App() {
  const [weightInGram, setWeightInGram] = useState(0);
  const [purity, setPurity] = useState(0);
  const [spot, setSpot] = useState("");
  const [bidSpot, setBidSpot] = useState("");
  const [weightInOz, setWeightInOz] = useState(0); // Separate state for FormType2
  const [goldAskValue, setGoldAskValue] = useState(null);
  const [goldBidValue, setGoldBidValue] = useState(null);
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("currency") || "CAD";
  });
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [buyBackPercentValue, setBuyBackPercentValue] = useState(
    DEFAULT_BUYBACK_PERCENT_VALUE,
  );

  const [selectedTab, setSelectedTab] = React.useState(0);

  // Fetch buyback config value from the provided Github Gist URL
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const res = await fetch(BUYBACK_CONFIG_URL, { cache: "no-store" });
        if (!res.ok || !isMounted) return;

        const configValue = Number((await res.json())?.buyBackPercentValue);
        if (
          isMounted &&
          Number.isFinite(configValue) &&
          configValue > 0 &&
          configValue <= 1
        ) {
          setBuyBackPercentValue(configValue);
        }
      } catch (err) {
        console.log("Buyback config error →", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event, newTab) => {
    setSelectedTab(newTab);
  };

  // Function to handle copying over the calculated metal weight
  const handleCopyWeight = () => {
    const metalWeightOz = parseFloat((weightInGram * purity).toFixed(4));
    setWeightInOz(metalWeightOz);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchFromWorker = async () => {
      try {
        const res =
          currency === "CAD"
            ? await fetch("https://muddy-tree-2922.forza664x.workers.dev/") //CAD
            : await fetch("https://quiet-base-2540.forza664x.workers.dev/"); // USD

        const data = await res.json();
        // figure out if response has cad or usd
        const currencyKey = data.cad ? "cad" : "usd";

        if (!isMounted) return;

        setGoldAskValue(data[currencyKey].ask.gold);
        setGoldBidValue(data[currencyKey].bid.gold);
        setSpot(data[currencyKey].ask.gold); // set spot input value
        setBidSpot(
          Number((data[currencyKey].bid.gold * buyBackPercentValue).toFixed(2)),
        ); // set bid input value (tab 3)
      } catch (err) {
        console.log("API error →", err);
      }
    };

    fetchFromWorker(); // initial fetch

    const intervalId = setInterval(fetchFromWorker, 60_000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [currency, buyBackPercentValue]);

  // For theme persistence across session
  useEffect(() => {
    localStorage.setItem("theme", viewMode);
  }, [viewMode]);
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  return (
    <div className={`App ${viewMode}`}>
      <div className="top-text">
        <b>Gold ({currency}) </b>
        <span>
          <b>Spot: </b>
          {goldAskValue
            ? `$${convertToCurrency(goldAskValue)}`
            : "Waiting..."}{" "}
        </span>
        |{" "}
        <span>
          <b>BB: </b>
          {goldBidValue
            ? `$${convertToCurrency(goldBidValue * buyBackPercentValue)}`
            : "Waiting..."}{" "}
        </span>
        <button
          className="btn-copy float-right"
          onClick={() =>
            viewMode === "light" ? setViewMode("dark") : setViewMode("light")
          }
        >
          {viewMode === "light" ? (
            <DarkModeIcon fontSize="small" />
          ) : (
            <LightModeIcon fontSize="small" />
          )}
        </button>
        <div>
          {currency === "USD" ? (
            <img className="flagimg" src={usdImage} alt="USD" />
          ) : (
            <img className="flagimg" src={cadImage} alt="CAD" />
          )}
          <button
            className="btn-copy"
            onClick={() =>
              currency === "CAD" ? setCurrency("USD") : setCurrency("CAD")
            }
          >
            Switch to {currency === "CAD" ? "USD" : "CAD"}
          </button>
        </div>
      </div>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            aria-label="basic tabs-wrapper"
            TabIndicatorProps={{
              sx: {
                backgroundColor: viewMode === "dark" ? "#3794ff" : "#010f8d",
              },
            }}
          >
            <CustomTab component="div" label="Value" {...a11yProps(0)} />
            <CustomTab label="Buying" {...a11yProps(1)} />
            <CustomTab label="Selling" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={selectedTab} index={0}>
          <FormType1
            weight={weightInGram}
            setWeight={setWeightInGram}
            purity={purity}
            setPurity={setPurity}
            spot={spot}
            setSpot={setSpot}
            onCopyWeight={handleCopyWeight}
          />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={1}>
          <FormType2
            spot={spot}
            setSpot={setSpot}
            weight={weightInOz}
            setWeight={setWeightInOz}
          />
        </CustomTabPanel>
        <CustomTabPanel value={selectedTab} index={2}>
          <FormType3
            spot={bidSpot}
            setSpot={setBidSpot}
            weight={weightInOz}
            setWeight={setWeightInOz}
          />
        </CustomTabPanel>
      </Box>
    </div>
  );
}
