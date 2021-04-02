# /**
# * Copyright (c) 2021 Visa, Inc.
# *
# * This source code is licensed under the MIT license
# * https://github.com/visa/visa-chart-components/blob/master/LICENSE
# *
# **/
#' visa charts 5.0.5
#'
#' Visa Chart Components wrapped in r htmlwidgets package
#'
#' @param tagName String. The custom web component HTML tag for the Visa Chart Component. Set by respective chart functions. 
#' @param linkData a valid R data frame. See more details in respective component functions.
#' @param nodeData a valid R data frame. See more details in respective component functions.
#' @param propList a list of props, created by each component function, see \href{https://github.com/visa/visa-chart-components}{Visa Chart Components}.
#' @param height Number. Height of chart container. 
#' @param width Number. Width of chart container.
#' @param ... All other props passed into the function will be passed through to the chart.
#' @import htmlwidgets
#'
#' @export
visaNodeLinkChart <- function(tagName, linkData, nodeData, propList, width = NULL, height = NULL, ...) {
  # create a list that contains the props
  x <- list(
    tagName = tagName,
    linkData = linkData,
    nodeData = nodeData,
    propList = propList,
    height = height,
    width = width,
    ...
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'visaNodeLinkChart',
    x,
    width = width,
    height = height,
    package = 'visachartR'
  )
}

#' Shiny bindings for visaNodeLinkChart
#'
#' Output and render functions for using visaNodeLinkChart within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a visaNodeLinkChart
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name visaNodeLinkChart-shiny
#'
#' @export
visaNodeLinkChartOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'visaNodeLinkChart', width, height, package = 'visachartR')
}

#' @rdname visaNodeLinkChart-shiny
#' @export
rendervisaNodeLinkChart <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, visaNodeLinkChartOutput, env, quoted = TRUE)
}
