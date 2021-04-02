# /**
# * Copyright (c) 2021 Visa, Inc.
# *
# * This source code is licensed under the MIT license
# * https://github.com/visa/visa-chart-components/blob/master/LICENSE
# *
# **/
#' pie_chart
#' @name pie_chart
#' @description R wrapper for \href{https://github.com/visa/visa-chart-components/tree/master/packages/pie-chart}{@visa/pie-chart} via \href{https://www.htmlwidgets.org/}{htmlwidgets}.
#'
#' Here is an example of pie-chart in action:
#'
#' \if{html}{\figure{pie-chart-1.png}{options: width=400 alt="example pie chart"}}
#'
#' @param data required to be a valid, R data frame. Data used to create chart, an array of objects which includes keys that map to chart accessors.
#' @param ordinalAccessor String. Key used to determine chart's categorical property.
#' @param valueAccessor String. Key used to determine chart's numeric property.
#' @param mainTitle String. The dynamic tag of title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param subTitle String. The dynamic tag for a sub title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param accessibility List(). Manages messages and settings for chart accessibility, see \href{https://github.com/visa/visa-chart-components/tree/master/packages/pie-chart#accessibility-props}{object definition}
#' @param props List(). A valid R list with additional property configurations, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/pie-chart}{@visa/pie-chart}
#' @param ... All other props passed into the function will be passed through to the chart, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/pie-chart}{@visa/pie-chart}.
#' @details To see all available options for the chart properties/API see \href{https://github.com/visa/visa-chart-components/tree/master/packages/pie-chart}{@visa/pie-chart}.
#' @export
#' @examples
#' library(tidyverse)
#' data.frame (HairEyeColor) %>% 
#'  filter(Hair=="Blond", Sex=="Male") %>% 
#'  mutate(blueEyes = if_else(Eye=="Blue", "Blue","Other")) %>% 
#'  group_by(blueEyes, Hair, Sex) %>% 
#'  summarise(FreqSum=sum(Freq), n=n()) %>% 
#'  pie_chart(
#'   "blueEyes",
#'   "FreqSum",
#'   mainTitle="How many males with Blonde hair have Blue eyes?",
#'   sortOrder="desc"
#'  )
pie_chart = function(data,
                     ordinalAccessor,
                     valueAccessor,
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
    mainTitle = mainTitle,
    subTitle = subTitle,
    list(accessibility = accessibility),
    props
  )

  # now we just pass this through to visaChart for render
  visaChart("pie-chart",
            data = data,
            propList = propList,
            ...)
}
