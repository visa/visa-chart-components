# visachartR

This package wraps [@visa/charts](https://github.com/visa/visa-chart-components/tree/main/packages/charts) web components for use in [R](https://www.r-project.org/), leveraging the [htmlwidgets](https://www.htmlwidgets.org/) R package. You can find visachartR on [CRAN](https://CRAN.R-project.org/package=visachartR), installation steps provided below.

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

- [@visa/bar-chart](https://github.com/visa/visa-chart-components/tree/main/packages/bar-chart)
- [@visa/clustered-bar-chart](https://github.com/visa/visa-chart-components/tree/main/packages/clustered-bar-chart)
- [@visa/stacked-bar-chart](https://github.com/visa/visa-chart-components/tree/main/packages/stacked-bar-chart)
- [@visa/line-chart](https://github.com/visa/visa-chart-components/tree/main/packages/line-chart)
- [@visa/pie-chart](https://github.com/visa/visa-chart-components/tree/main/packages/pie-chart)
- [@visa/scatter-plot](https://github.com/visa/visa-chart-components/tree/main/packages/scatter-plot)
- [@visa/heat-map](https://github.com/visa/visa-chart-components/tree/main/packages/heat-map)
- [@visa/circle-packing](https://github.com/visa/visa-chart-components/tree/main/packages/circle-packing)
- [@visa/parallel-plot](https://github.com/visa/visa-chart-components/tree/main/packages/parallel-plot)
- [@visa/dumbbell-plot](https://github.com/visa/visa-chart-components/tree/main/packages/dumbbell-plot)
- [@visa/world-map](https://github.com/visa/visa-chart-components/tree/main/packages/world-map)
- [@visa/alluvial-diagram](https://github.com/visa/visa-chart-components/tree/main/packages/alluvial-diagram)

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
