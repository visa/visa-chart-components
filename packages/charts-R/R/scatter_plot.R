# /**
# * Copyright (c) 2021 Visa, Inc.
# *
# * This source code is licensed under the MIT license
# * https://github.com/visa/visa-chart-components/blob/master/LICENSE
# *
# **/
#' scatter_plot
#' @name scatter_plot
#' @description R wrapper for \href{https://github.com/visa/visa-chart-components/tree/master/packages/scatter-plot}{@visa/scatter-plot} via \href{https://www.htmlwidgets.org/}{htmlwidgets}.
#'
#' Here is an example of scatter-plot in action:
#'
#' \if{html}{\figure{scatter-plot-1.png}{options: width=400 alt="example scatter plot"}}
#'
#' @inheritParams bar_chart
#' @param xAccessor String. Key used to determine each point's position along the x-axis.
#' @param yAccessor String. Key used to determine each point's position along the y-axis.
#' @param accessibility List(). Manages messages and settings for chart accessibility, see \href{https://github.com/visa/visa-chart-components/tree/master/packages/scatter-plot#accessibility-props}{object definition}
#' @param props List(). A valid R list with additional property configurations, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/scatter-plot}{@visa/scatter-plot}
#' @param ... All other props passed into the function will be passed through to the chart, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/scatter-plot}{@visa/scatter-plot}.
#' @details To see all available options for the chart properties/API see \href{https://github.com/visa/visa-chart-components/tree/master/packages/scatter-plot}{@visa/scatter-plot}.
#' @return a visaChart htmlwidget object for plotting a scatter plot
#' @export
#' @examples
#' library(tidyverse)
#' scatter_plot(mtcars[order(mtcars$cyl),], "wt", "mpg", "cyl")
scatter_plot = function(data,
                        xAccessor,
                        yAccessor,
                        groupAccessor = "",
                        mainTitle = "",
                        subTitle = "",
                        accessibility = list(),
                        props = list(),
                        ...) {

  # now we are going to append all of these inputted props into the
  # expected prop list and also the "..." operator
  propList = c(
    xAccessor = xAccessor,
    yAccessor = yAccessor,
    groupAccessor = groupAccessor,
    mainTitle = mainTitle,
    subTitle = subTitle,
    list(accessibility = accessibility),
    props
  )

  # now we just pass this through to visaChart for render
  visaChart("scatter-plot",
            data = data,
            propList = propList,
            ...)
}
