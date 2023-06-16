# /**
# * Copyright (c) 2021 Visa, Inc.
# *
# * This source code is licensed under the MIT license
# * https://github.com/visa/visa-chart-components/blob/master/LICENSE
# *
# **/
#' world_map
#' @name world_map
#' @description R wrapper for \href{https://github.com/visa/visa-chart-components/tree/master/packages/world-map}{@visa/world-map} via \href{https://www.htmlwidgets.org/}{htmlwidgets}.
#'
#' Here is an example of world-map in action:
#' \if{html}{\figure{world-map-1.png}{options: width=400 alt="example world map"}}
#'
#' @param data required to be a valid, R data frame. Data used to create chart, an array of objects which includes keys that map to chart accessors.
#' @param joinAccessor String. Key used to determine country's key property (ISO 3-Digit Code).
#' @param joinNameAccessor String. Key used to determine country's name property.
#' @param markerAccessor String. Key used to determine marker's key property.
#' @param markerNameAccessor String. Key used to determine marker's name property.
#' @param valueAccessor String. Key used to determine the country/marker's numeric property.
#' @param groupAccessor String. Key used to determine country/marker color.
#' @param latitudeAccessor String. Key used to determine marker's latitude property.
#' @param longitudeAccessor String. Key used to determine marker's longitude property.
#' @param mainTitle String. The dynamic tag of title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param subTitle String. The dynamic tag for a sub title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param accessibility List(). Manages messages and settings for chart accessibility, see \href{https://github.com/visa/visa-chart-components/tree/master/packages/world-map#accessibility-props}{object definition}
#' @param props List(). A valid R list with additional property configurations, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/world-map}{@visa/world-map}
#' @param ... All other props passed into the function will be passed through to the chart, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/world-map}{@visa/world-map}.
#' @details To see all available options for the chart properties/API see \href{https://github.com/visa/visa-chart-components/tree/master/packages/world-map}{@visa/world-map}.
#' @return a visaChart htmlwidget object for plotting a world map
#' @export
#' @examples
#' library(dplyr)
#' quakes %>%
#'  sample_n(100) %>%
#'  tibble::rowid_to_column() %>%
#'  world_map(
#'    markerAccessor = "rowid",
#'    latitudeAccessor = "long",
#'    longitudeAccessor = "lat",
#'    valueAccessor = "stations",
#'    markerStyle=list(
#'     visible=TRUE,
#'     fill=TRUE,
#'     opacity=.5,
#'     radiusRange=c(5,15)
#'    )
#'  )
world_map = function(data,
                     joinAccessor = "",
                     joinNameAccessor = "",
                     markerAccessor = "",
                     markerNameAccessor = "",
                     latitudeAccessor = "",
                     longitudeAccessor = "",
                     valueAccessor,
                     groupAccessor = "",
                     mainTitle = "",
                     subTitle = "",
                     accessibility = list(),
                     props = list(),
                     ...) {

  # now we are going to append all of these inputted props into the
  # expected prop list and also the "..." operator
  propList = c(
    joinAccessor = joinAccessor,
    joinNameAccessor = joinNameAccessor,
    markerAccessor = markerAccessor,
    markerNameAccessor = markerNameAccessor,
    valueAccessor = valueAccessor,
    groupAccessor = groupAccessor,
    latitudeAccessor = latitudeAccessor,
    longitudeAccessor = longitudeAccessor,
    mainTitle = mainTitle,
    subTitle = subTitle,
    list(accessibility = accessibility),
    props
  )

  # now we just pass this through to visaChart for render
  visaChart("world-map",
            data = data,
            propList = propList,
            ...)
}
