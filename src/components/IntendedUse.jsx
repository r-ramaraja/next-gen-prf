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
            <strong>What is intended use?</strong>
          </p>
          <p>
            <em>Intended use</em> refers to the specified purpose for which the insured acreage is
            used. The <em>intended use </em>must be reported and insured as either <em>haying</em>{" "}
            or <em>grazing</em>, as chosen by the insured. It is crucial to note that the same
            acreage cannot be reported or insured with both <em>haying</em> and <em>grazing</em> as
            the <em>intended use</em> in the same crop year.
            <br />
            When determining which <em>intended use</em> to select, factors like the type of forage,
            location, elevation, and the time period when precipitation is most needed for the
            insured crop should be considered.
          </p>

          <p>
            If you choose <em>haying</em> as the intended use, you need to specify the irrigation
            and organic practices used for the insured acreage.
          </p>
          <p>
            <strong>Irrigation Practice:</strong>
            <br />
            <em>Irrigation practice</em> refers to the method or approach used for supplying water
            to crops. The categorization of irrigation practices is simplified into two primary
            options: <em>Irrigated</em> and <em>Non-irrigated</em>.
          </p>

          <ol>
            <li>
              <strong>Irrigated</strong>: This option applies to acreage that receives water through
              artificial means, such as sprinklers, drip systems, or other forms of irrigation.
            </li>
            <li>
              <strong>Non-irrigated</strong>: This option is for acreage that relies solely on
              natural rainfall for water.
            </li>
          </ol>

          <p>
            <strong>Organic Practice:</strong>
            <br />
            <em>Organic Practice</em> refers to specific agricultural practices for cultivating
            crops that are in line with organic farming standards.The options for organic practice
            are categorized into three distinct types: <em>Non-Organic</em>, <em>Certified</em>, and{" "}
            <em>Transitional</em>.
          </p>
          <ol>
            <li>
              <strong>Non-Organic</strong>: This applies to acreage that is not managed using
              organic methods.
            </li>
            <li>
              <strong>Certified Organic</strong>: This category is for acreage managed according to
              certified organic farming practices. These practices must comply with the standards
              set by an organic certification body, and the land must be officially certified as
              organic.
            </li>
            <li>
              <strong>Transitional</strong>: This option is for acreage that is converting from
              conventional to organic farming practices. Transition to organic typically involves a
              multi-year process in which the land is managed according to organic standards but has
              not yet been certified.&nbsp;
            </li>
          </ol>

          <br />
          <p>
            <strong>How does it impact the policy?</strong>
          </p>
          <p>
            The choice of <em>intended use</em> impacts how the insurance coverage works, especially
            in how the<em> county base value</em> is determined and, subsequently, how other
            insurance components are calculated. The <em>county base value</em> is an estimate of
            the average value per acre for a particular crop in a county.
          </p>
          <p>
            The<em> intended use</em> directly influences the <em>county base value</em>, as
            different uses have different average values. Due to the general market value, if you
            choose <em>haying</em>, the <em>county base value</em> might be higher than if you
            choose <em>grazing</em>. Higher <em>county base values</em> generally lead to higher
            protection levels and premiums, potentially resulting in higher indemnities in case of a
            claim, but they also mean a higher cost of insurance premiums for the producer.
          </p>
          <p>
            For the <em>intended use </em>of <em>haying</em>,
            <br />
            When choosing<em> irrigation practice</em>, selecting the <em>irrigated</em> option
            often indicates a potentially lower risk of drought-related loss, as the crop or forage
            has a supplementary water source beyond natural rainfall. Hence, <em>irrigated</em>{" "}
            acreage will have a different<em> county base value</em> due to the perceived lower risk
            and potentially higher yield. Choosing the <em>non-irrigated</em> option might carry a
            higher risk of drought-related loss, given the dependence on rainfall, especially in
            areas prone to irregular or insufficient rainfall. Consequently, the insurance terms for{" "}
            <em>non-irrigated</em> acreage, particularly the <em>county base value</em>, might
            reflect this higher risk.
            <br />
            The choice of the <em>organic practice</em> also influences <em>county base values</em>.
            Typically, <em>certified</em> organic acreage commands the highest{" "}
            <em>county base values</em>, reflecting the premium market value of organic produce.{" "}
            <em>Transitional</em> organic practices, representing acreage in the process of
            obtaining organic certification, generally yield the next highest base values. Lastly,{" "}
            <em>non-organic</em> acreages, which utilize conventional farming practices, are
            associated with lower county base values in comparison.
          </p>
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
