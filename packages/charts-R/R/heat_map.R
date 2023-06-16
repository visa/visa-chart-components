# /**
# * Copyright (c) 2021, 2023 Visa, Inc.
# *
# * This source code is licensed under the MIT license
# * https://github.com/visa/visa-chart-components/blob/master/LICENSE
# *
# **/
#' heat_map
#' @name heat_map
#' @description R wrapper for \href{https://github.com/visa/visa-chart-components/tree/master/packages/heat-map}{@visa/heat-map} via \href{https://www.htmlwidgets.org/}{htmlwidgets}.
#'
#' Here is an example of heat-map in action:
#'
#' \if{html}{\figure{heat-map-1.png}{options: width=400 alt="example heat map"}}
#'
#' @param data required to be a valid, R data frame. Data used to create chart, an array of objects which includes keys that map to chart accessors.
#' @param xAccessor String. Key used to determine the x-axis categorical value. (similar to x in ggplot)
#' @param yAccessor String. Key used to determine the y-axis categorical value. (similar to y in ggplot)
#' @param valueAccessor String. Key used to determine heatmap's numeric property, for assigning color.
#' @param mainTitle String. The dynamic tag of title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param subTitle String. The dynamic tag for a sub title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param accessibility List(). Manages messages and settings for chart accessibility, see \href{https://github.com/visa/visa-chart-components/tree/master/packages/heat-map#accessibility-props}{object definition}
#' @param props List(). A valid R list with additional property configurations, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/heat-map}{@visa/heat-map}
#' @param ... All other props passed into the function will be passed through to the chart, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/heat-map}{@visa/heat-map}.
#' @details To see all available options for the chart properties/API see \href{https://github.com/visa/visa-chart-components/tree/master/packages/heat-map}{@visa/heat-map}.
#' @return a visaChart htmlwidget object for plotting a heat map
#' @export
#' @examples
#' library(dplyr)
#' data.frame(UCBAdmissions) %>%
#'   filter(Admit == "Rejected") %>%
#'   heat_map("Dept","Gender", "Freq")
heat_map = function(data,
                        xAccessor,
                        yAccessor,
                        valueAccessor,
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
    valueAccessor = valueAccessor,
    mainTitle = mainTitle,
    subTitle = subTitle,
    list(accessibility = accessibility),
    props
  )

  # now we just pass this through to visaChart for render
  visaChart("heat-map",
            data = data,
            propList = propList,
            ...)
}
