import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";
import IntendedUseViz from "./visualizations/intended_use_step/IntendedUseViz";

export default function IntendedUse({ tabState, setTabState, marker, isGuided }) {
  const { intendedUse, irrigationPractice, organicPractice } = tabState;
  const { id } = marker;

  return (
    <Grid container item spacing={2}>
      <Grid item>
        <FormControl sx={{ width: "150px" }}>
          <InputLabel>Intended Use</InputLabel>
          <Select
            value={intendedUse}
            label="Intended Use"
            onChange={(event) =>
              setTabState(
                {
                  ...tabState,
                  intendedUse: event.target.value,
                },
                id
              )
            }
          >
            <MenuItem value="grazing">Grazing</MenuItem>
            <MenuItem value="haying">Haying</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {intendedUse === "haying" && (
        <Grid item>
          <FormControl sx={{ width: "150px" }}>
            <InputLabel>Irrigation Practice</InputLabel>
            <Select
              value={irrigationPractice}
              label="Irrigation Practice"
              onChange={(event) =>
                setTabState(
                  {
                    ...tabState,
                    irrigationPractice: event.target.value,
                  },
                  id
                )
              }
            >
              <MenuItem value="irrigated">Irrigated</MenuItem>
              <MenuItem value="non-irrigated">Non-Irrigated</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}

      {intendedUse === "haying" && irrigationPractice === "non-irrigated" && (
        <Grid item>
          <FormControl sx={{ width: "150px" }}>
            <InputLabel>Organic Practice</InputLabel>
            <Select
              value={organicPractice}
              label="Organic Practice"
              onChange={(event) =>
                setTabState(
                  {
                    ...tabState,
                    organicPractice: event.target.value,
                  },
                  id
                )
              }
            >
              <MenuItem value="non-organic">Not Organic</MenuItem>
              <MenuItem value="certified">Certified</MenuItem>
              <MenuItem value="transitional">Transitional</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      )}

      {isGuided && (
        <Grid item>
          <p>
            <span style={{ textDecoration: "underline" }}>
              <strong>Definition</strong>
            </span>
          </p>
          <p>
            <em>Intended use</em> refers to the purpose for which the insured acreage is reported
            and insured. The two eligible options are <em>haying</em> or <em>grazing</em>.
          </p>
          <p>
            The same acreage <strong>cannot</strong> be reported or insured with both{" "}
            <em>haying</em> and <em>grazing</em> as the <em>intended use</em> in the same crop year.
          </p>
          {intendedUse === "haying" && (
            <React.Fragment>
              <p>
                Selecting <em>haying</em> as the intended use requires specifying the type of
                irrigation practice used.
              </p>

              <p>
                <strong>Irrigation Practice:</strong>
                <br />
                <em>Irrigation practice</em> refers to how water is supplied to crops and has two
                main categories:
              </p>
              <ol>
                <li>
                  <strong>Irrigated</strong>: Acreage receives water through artificial means, e.g.,
                  sprinklers or drip systems.
                </li>
                <li>
                  <strong>Non-irrigated</strong>: Reliant solely on natural rainfall.
                </li>
              </ol>
              {irrigationPractice === "non-irrigated" && (
                <React.Fragment>
                  <p>
                    Selecting the <em>non-irrigated option</em> requires specifying the type of{" "}
                    <em>organic practice</em> used.
                  </p>
                  <p>
                    <strong>Organic Practice:</strong>
                    <br />
                    <em>Organic Practice</em> refers to specific agricultural practices for
                    cultivating crops that are in line with organic farming standards.The options
                    are:
                  </p>
                  <ol>
                    <li>
                      <strong>Non-Organic</strong>: This applies to acreage that is not managed
                      using organic methods.
                    </li>
                    <li>
                      <strong>Certified Organic</strong>: This applies to acreage officially
                      certified as organic and managed according to certified organic farming
                      practices.
                    </li>
                    <li>
                      <strong>Transitional</strong>: This option is for acreage that is converting
                      from conventional to organic farming practices.
                    </li>
                  </ol>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          <p>
            <span style={{ textDecoration: "underline" }}>
              <strong>Impact</strong>
            </span>
          </p>
          <p>
            The choice of <em>intended use</em> impacts how the<em> county base value</em> is
            determined and, subsequently, how other insurance components are calculated.
            <br />
            The <em>county base value</em> is an estimate of the average value per acre for a
            particular crop in a county. Higher <em>county base values</em> generally lead to higher
            protection levels and premiums, potentially resulting in higher indemnities in case of a
            claim.
          </p>
          {intendedUse === "haying" && (
            <React.Fragment>
              <p>
                When choosing<em> irrigation practice</em>, selecting the <em>irrigated</em> option
                often indicates a potentially lower risk of drought-related loss, as the land has a
                supplementary water source beyond natural rainfall. Hence, <em>irrigated</em>{" "}
                acreage will have a lower<em> county base value</em> due to the perceived lower risk
                and potentially higher yield.
                <br />
                Choosing the <em>non-irrigated</em> option might carry a higher risk of
                drought-related loss, given the dependence on rainfall, especially in areas prone to
                irregular or insufficient rainfall. Consequently, the <em>county base value</em> is
                higher for <em>non-irrigated</em> acreage to reflect this higher risk.
              </p>

              {irrigationPractice === "non-irrigated" && (
                <p>
                  The choice of the <em>organic practice</em> also influences{" "}
                  <em>county base values</em>. Typically, <em>certified</em> organic acreage
                  commands the highest <em>county base values</em>, reflecting the premium market
                  value of organic produce. <em>Transitional</em> and <em>non-organic</em> acreages
                  are next, generally yielding the same
                  <em> county base values</em>.
                </p>
              )}
            </React.Fragment>
          )}
        </Grid>
      )}
      {isGuided && (
        <Grid item>
          <IntendedUseViz marker={marker} />
        </Grid>
      )}
    </Grid>
  );
}
