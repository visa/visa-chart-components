# /**
# * Copyright (c) 2021 Visa, Inc.
# *
# * This source code is licensed under the MIT license
# * https://github.com/visa/visa-chart-components/blob/master/LICENSE
# *
# **/
#' dumbbell_plot
#' @name dumbbell_plot
#' @description R wrapper for \href{https://github.com/visa/visa-chart-components/tree/master/packages/dumbbell-plot}{@visa/dumbbell-plot} via \href{https://www.htmlwidgets.org/}{htmlwidgets}.
#'
#' Here is an example of dumbbell-plot in action:
#'
#' \if{html}{\figure{dumbbell-plot-1.png}{options: width=400 alt="example dumbbell plot"}}
#'
#' @param data required to be a valid, R data frame. Data used to create chart, an array of objects which includes keys that map to chart accessors.
#' @param ordinalAccessor String. Key used to determine dumbbell's categorical property. (similar to x in ggplot)
#' @param valueAccessor String. Key used to determine dumbbell's numeric property. (similar to y in ggplot)
#' @param seriesAccessor String. Key used to determine dumbbell's series.
#' @param mainTitle String. The dynamic tag of title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param subTitle String. The dynamic tag for a sub title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param accessibility List(). Manages messages and settings for chart accessibility, see \href{https://github.com/visa/visa-chart-components/tree/master/packages/dumbbell-plot#accessibility-props}{object definition}
#' @param props List(). A valid R list with additional property configurations, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/dumbbell-plot}{@visa/dumbbell-plot}
#' @param ... All other props passed into the function will be passed through to the chart, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/dumbbell-plot}{@visa/dumbbell-plot}.
#' @details To see all available options for the chart properties/API see \href{https://github.com/visa/visa-chart-components/tree/master/packages/dumbbell-plot}{@visa/dumbbell-plot}.
#' @return a visaChart htmlwidget object for plotting a dumbbell plot
#' @export
#' @examples
#' library(dplyr)
#' data.frame(UCBAdmissions) %>%
#'   filter(Admit == "Rejected") %>%
#'   dumbbell_plot("Dept","Freq","Gender")
dumbbell_plot = function(data,
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
  visaChart("dumbbell-plot",
            data = data,
            propList = propList,
            ...)
}
