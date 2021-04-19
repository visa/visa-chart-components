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
#' @param data a valid R data frame. See more details in respective component functions.
#' @param propList a list of props, created by each component function, see \href{https://github.com/visa/visa-chart-components}{Visa Chart Components}.
#' @param height Number. Height of chart container.
#' @param width Number. Width of chart container.
#' @param ... All other props passed into the function will be passed through to the chart.
#' @return a visaChart htmlwidget object for creating a variety of plot types
#' @import htmlwidgets
#'
#' @export
visaChart <- function(tagName, data, propList, width = NULL, height = NULL, ...) {
  # create a list that contains the props
  x <- list(
    tagName = tagName,
    data = data,
    propList = propList,
    height = height,
    width = width,
    ...
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'visaChart',
    x,
    width = width,
    height = height,
    package = 'visachartR'
  )
}

#' Shiny bindings for visaChart
#'
#' Output and render functions for using visaChart within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a visaChart
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#' @return a Shiny output or render function for visaChart htmlwidgets
#'
#' @name visaChart-shiny
#'
#' @export
visaChartOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'visaChart', width, height, package = 'visachartR')
}

#' @rdname visaChart-shiny
#' @export
renderVisaChart <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, visaChartOutput, env, quoted = TRUE)
}
