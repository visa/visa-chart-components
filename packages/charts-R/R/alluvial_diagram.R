# /**
# * Copyright (c) 2021, 2023 Visa, Inc.
# *
# * This source code is licensed under the MIT license
# * https://github.com/visa/visa-chart-components/blob/master/LICENSE
# *
# **/
#' alluvial_diagram
#' @name alluvial_diagram
#' @description R wrapper for \href{https://github.com/visa/visa-chart-components/tree/master/packages/alluvial-diagram}{@visa/alluvial-diagram} via \href{https://www.htmlwidgets.org/}{htmlwidgets}.
#'
#' Here is an example of alluvial-diagram in action:
#' \if{html}{\figure{alluvial-diagram-1.png}{options: width=400 alt="example alluvial diagram"}}
#'
#' @param linkData required to be a valid, R data frame. Data used to create links in diagram, an array of objects which includes keys that map to chart accessors. See \href{https://github.com/d3/d3-sankey}{d3-sankey} for additional detail on data requirements.
#' @param nodeData required to be a valid, R data frame. Optional. Data used to create nodes in diagram, an array of objects which includes key that map to chart accessors. See \href{https://github.com/d3/d3-sankey}{d3-sankey} for additional detail on data requirements.
#' @param sourceAccessor String. Key used to determine link's source, must be a node.
#' @param targetAccessor String. Key used to determine link's target, must be a node.
#' @param valueAccessor String. Key used to determine link (and ultimately node size).
#' @param nodeIDAccessor String. Key used to determine unique node identifiers. Requires nodeData to be populated.
#' @param groupAccessor String. Key used to determine link's group or category.
#' @param mainTitle String. The dynamic tag of title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param subTitle String. The dynamic tag for a sub title for the map (or you can create your own separately). See \code{highestHeadingLevel} prop for how tags get assigned.
#' @param accessibility List(). Manages messages and settings for chart accessibility, see \href{https://github.com/visa/visa-chart-components/tree/master/packages/alluvial-diagram#accessibility-props}{object definition}
#' @param props List(). A valid R list with additional property configurations, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/alluvial-diagram}{@visa/alluvial-diagram}
#' @param ... All other props passed into the function will be passed through to the chart, see all props for \href{https://github.com/visa/visa-chart-components/tree/master/packages/alluvial-diagram}{@visa/alluvial-diagram}.
#' @details To see all available options for the chart properties/API see \href{https://github.com/visa/visa-chart-components/tree/master/packages/alluvial-diagram}{@visa/alluvial-diagram}.
#' @return a visaNodeLinkChart htmlwidget object for plotting an alluvial diagram
#' @export
#' @examples
#' library(dplyr)
#' data.frame(HairEyeColor) %>%
#'   filter(Sex=="Female") %>%
#'   mutate(newHair = paste(Hair,"-Hair")) %>%
#'   mutate(newEye = paste(Eye,"-Eye")) %>%
#'   alluvial_diagram(sourceAccessor = "newHair", targetAccessor = "newEye", valueAccessor = "Freq")
alluvial_diagram = function(linkData,
                          nodeData = NULL,
                          sourceAccessor,
                          targetAccessor,
                          valueAccessor,
                          nodeIDAccessor = "",
                          groupAccessor = "",
                          mainTitle = "",
                          subTitle = "",
                          accessibility = list(),
                          props = list(),
                          ...) {

  # now we are going to append all of these inputted props into the
  # expected prop list and also the "..." operator
  propList = c(
    linkData = linkData,
    nodeData = nodeData,
    sourceAccessor = sourceAccessor,
    targetAccessor = targetAccessor,
    valueAccessor = valueAccessor,
    nodeIDAccessor = nodeIDAccessor,
    groupAccessor = groupAccessor,
    mainTitle = mainTitle,
    subTitle = subTitle,
    list(accessibility = accessibility),
    props
  )

  # now we just pass this through to visaNodeLinkChart for render
  visaNodeLinkChart("alluvial-diagram",
            linkData = linkData,
            nodeData = nodeData,
            propList = propList,
            ...)
}
