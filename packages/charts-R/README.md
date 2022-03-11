# visachartR

This package wraps [@visa/charts](../charts) web components for use in [R](https://www.r-project.org/), leveraging the [htmlwidgets](https://www.htmlwidgets.org/) R package. You can find visachartR on [CRAN](https://CRAN.R-project.org/package=visachartR), installation steps provided below.

---

### Installation Steps

- CRAN Version
  ```
  $ install.packages("visachartR")
  ```
- Development version:
  ```
  $ remotes::install_github("visa/visa-chart-components/packages/charts-R")
  ```

---

#### Components with `Ready` status in this bundle

- [@visa/bar-chart](../bar-chart)
- [@visa/clustered-bar-chart](../clustered-bar-chart)
- [@visa/stacked-bar-chart](../stacked-bar-chart)
- [@visa/line-chart](../line-chart)
- [@visa/pie-chart](../pie-chart)
- [@visa/scatter-plot](../scatter-plot)
- [@visa/heat-map](../heat-map)
- [@visa/circle-packing](../circle-packing)
- [@visa/parallel-plot](../parallel-plot)
- [@visa/dumbbell-plot](../dumbbell-plot)
- [@visa/world-map](../world-map)
- [@visa/alluvial-diagram](../alluvial-diagram)

<!-- #### Components with `Development` status -->
<hr>

#### <a name="R_components" href="#R_components">#</a> Use VCC as R functions

Step 1: Install `install.packages("visachartR")`

Step 2: Use component as any other R function

```R
library(visachartR)

bar_chart(BOD, ordinalAccessor="Time", valueAccessor="demand")

scatter_plot(mtcars[order(mtcars$cyl),], "wt", "mpg", "cyl")
```
