# /**
# * Copyright (c) 2021 Visa, Inc.
# *
# * This source code is licensed under the MIT license
# * https://github.com/visa/visa-chart-components/blob/master/LICENSE
# *
# **/
#' clustered_bar_chart
#' @name clustered_bar_chart
#' @description R wrapper for \href{https://github.com/visa/visa-chart-components/tree/master/packages/clustered-bar-chart}{@visa/clustered-bar-chart} via \href{https://www.htmlwidgets.org/}{htmlwidgets}.
#'
#' Here is an example of clustered-bar-chart in action:
#' \if{html}{\figure{figures/clustered-bar-chart-1.png}{options: width=400 alt="example clustered bar chart"}}
#'
#' @param data required to be a valid, R data frame. Data used to create chart, an array of objects which includes keys that map to chart accessors.
#' @param ordinalAccessor String. Key used to determine bar's categorical property, within groups. (similar to x in ggplot)
#' @param valueAccessor String. Key used to determine bar's numeric property. (similar to y in ggplot)
#' @param groupAccessor String. Key used to determine bar clusters.
#' @param mainTitle String. The dynamic tag of title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param subTitle String. The dynamic tag for a sub title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param accessibility List(). Manages messages and settings for chart accessibility, see \href{https://github.com/visa/visa-chart-components/tree/master/packages/clustered-bar-chart#accessibility-props}{object definition}
#' @param props List(). A valid R list with additional property configurations, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/clustered-bar-chart}{@visa/clustered-bar-chart}
#' @param ... All other props passed into the function will be passed through to the chart, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/clustered-bar-chart}{@visa/clustered-bar-chart}.
#' @details To see all available options for the chart properties/API see \href{https://github.com/visa/visa-chart-components/tree/master/packages/clustered-bar-chart}{@visa/clustered-bar-chart}.
#' @export
#' @examples
#' library(tidyverse)
#' data.frame(UCBAdmissions) %>%
#'   filter(Admit == "Rejected") %>%
#'   clustered_bar_chart("Gender","Freq","Dept")
clustered_bar_chart = function(data,
                     ordinalAccessor,
                     valueAccessor,
                     groupAccessor,
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
    groupAccessor = groupAccessor,
    mainTitle = mainTitle,
    subTitle = subTitle,
    list(accessibility = accessibility),
    props
  )

  # now we just pass this through to visaChart for render
  visaChart("clustered-bar-chart",
            data = data,
            propList = propList,
            ...)
}
