# /**
# * Copyright (c) 2021 Visa, Inc.
# *
# * This source code is licensed under the MIT license
# * https://github.com/visa/visa-chart-components/blob/master/LICENSE
# *
# **/
#' parallel_plot
#' @name parallel_plot
#' @description R wrapper for \href{https://github.com/visa/visa-chart-components/tree/master/packages/parallel-plot}{@visa/parallel-plot} via \href{https://www.htmlwidgets.org/}{htmlwidgets}.
#'
#' Here is an example of parallel-plot in action:
#'
#' \if{html}{\figure{parallel-plot-1.png}{options: width=400 alt="example parallel plot"}}
#'
#' @param data required to be a valid, R data frame. Data used to create chart, an array of objects which includes keys that map to chart accessors.
#' @param ordinalAccessor String. Key used to determine line's categorical property. (similar to x in ggplot)
#' @param valueAccessor String. Key used to determine line's numeric property. (similar to y in ggplot)
#' @param seriesAccessor String. Key used to determine series (e.g., color/texture).
#' @param mainTitle String. The dynamic tag of title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param subTitle String. The dynamic tag for a sub title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param accessibility List(). Manages messages and settings for chart accessibility, see \href{https://github.com/visa/visa-chart-components/tree/master/packages/parallel-plot#accessibility-props}{object definition}
#' @param props List(). A valid R list with additional property configurations, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/parallel-plot}{@visa/parallel-plot}
#' @param ... All other props passed into the function will be passed through to the chart, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/parallel-plot}{@visa/parallel-plot}.
#' @details To see all available options for the chart properties/API see \href{https://github.com/visa/visa-chart-components/tree/master/packages/parallel-plot}{@visa/parallel-plot}.
#' @export
#' @examples
#' library(dplyr)
#' ChickWeight %>%
#'  filter(Chick==1 | Chick == 4) %>%
#'  parallel_plot("Time", "weight", "Chick",
#'                showBaselineX=FALSE,
#'                xAxis=list(label="Time",format="0a", visible=TRUE),
#'                yAxis=list(label="Weight", visible=FALSE, gridVisible=FALSE),
#'                mainTitle = "Selected chick weight over time",
#'                dataLabel=list(visible = TRUE,
#'                               labelAccessor = "weight",
#'                               placement = "bottom-right",
#'                               format = "0a"))
parallel_plot = function(data,
                     ordinalAccessor,
                     valueAccessor,
                     seriesAccessor,
                     mainTitle = "",
                     subTitle = "",
                     accessibility = list(),
                     props = list(),
                     ...) {

  # now we are going to append all of these inputted props into the
  # expected prop list and also the "..." operator
  propList = c(
    ordinalAccessor = ordinalAccessor,
    valueAccessor = valueAccessor,
    seriesAccessor = seriesAccessor,
    mainTitle = mainTitle,
    subTitle = subTitle,
    list(accessibility = accessibility),
    props
  )

  # now we just pass this through to visaChart for render
  visaChart("parallel-plot",
            data = data,
            propList = propList,
            ...)
}
