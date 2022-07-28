# /**
# * Copyright (c) 2022 Visa, Inc.
# *
# * This source code is licensed under the MIT license
# * https://github.com/visa/visa-chart-components/blob/master/LICENSE
# *
# **/
from __future__ import annotations
from os import sync
import ipywidgets as widgets
from ipywidgets import widget_serialization
from traitlets import Unicode, Dict, List, Any, validate
import pandas as pd
from ._version import __version__

# See js/lib/charts.js for the frontend counterpart to this file.

view_name = 'ChartView'
model_name = 'ChartModel'
_module = '@visa/charts-python'

@widgets.register
class BarChart(widgets.DOMWidget):
    """A bar-chart widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode(view_name).tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode(model_name).tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode(_module).tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode(_module).tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode(__version__).tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode(__version__).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    chartType = Unicode('bar-chart').tag(sync=True)
    data = Any().tag(sync=True, **widget_serialization)
    ordinalAccessor = Unicode('label').tag(sync=True)
    valueAccessor = Unicode('value').tag(sync=True)
    groupAccessor = Unicode().tag(sync=True)
    mainTitle = Unicode().tag(sync=True)
    subTitle = Unicode().tag(sync=True)
    accessibility = Dict().tag(sync=True, **widget_serialization)
    config = Dict().tag(sync=True, **widget_serialization)

    @validate('data')
    def _validate_data(self, proposal):
        if isinstance(proposal.value, pd.DataFrame):
            return proposal.value.to_dict('records')
        elif isinstance(proposal.value, list):
            return proposal.value
        else:
            raise ValueError('Expecting a DataFrame or List, got {}'.format(type(proposal.value)))

@widgets.register
class ClusteredBarChart(widgets.DOMWidget):
    """A clustered-bar-chart widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode(view_name).tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode(model_name).tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode(_module).tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode(_module).tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode(__version__).tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode(__version__).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    chartType = Unicode('clustered-bar-chart').tag(sync=True)
    data = Any().tag(sync=True, **widget_serialization)
    ordinalAccessor = Unicode('label').tag(sync=True)
    valueAccessor = Unicode('value').tag(sync=True)
    groupAccessor = Unicode().tag(sync=True)
    mainTitle = Unicode().tag(sync=True)
    subTitle = Unicode().tag(sync=True)
    accessibility = Dict().tag(sync=True, **widget_serialization)
    config = Dict().tag(sync=True, **widget_serialization)

    @validate('data')
    def _validate_data(self, proposal):
        if isinstance(proposal.value, pd.DataFrame):
            return proposal.value.to_dict('records')
        elif isinstance(proposal.value, list):
            return proposal.value
        else:
            raise ValueError('Expecting a DataFrame or List, got {}'.format(type(proposal.value)))

@widgets.register
class StackedBarChart(widgets.DOMWidget):
    """A stacked-bar-chart widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode(view_name).tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode(model_name).tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode(_module).tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode(_module).tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode(__version__).tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode(__version__).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    chartType = Unicode('stacked-bar-chart').tag(sync=True)
    data = Any().tag(sync=True, **widget_serialization)
    ordinalAccessor = Unicode('label').tag(sync=True)
    valueAccessor = Unicode('value').tag(sync=True)
    groupAccessor = Unicode().tag(sync=True)
    mainTitle = Unicode().tag(sync=True)
    subTitle = Unicode().tag(sync=True)
    accessibility = Dict().tag(sync=True, **widget_serialization)
    config = Dict().tag(sync=True, **widget_serialization)

    @validate('data')
    def _validate_data(self, proposal):
        if isinstance(proposal.value, pd.DataFrame):
            return proposal.value.to_dict('records')
        elif isinstance(proposal.value, list):
            return proposal.value
        else:
            raise ValueError('Expecting a DataFrame or List, got {}'.format(type(proposal.value)))

@widgets.register
class LineChart(widgets.DOMWidget):
    """A line-chart widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode(view_name).tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode(model_name).tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode(_module).tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode(_module).tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode(__version__).tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode(__version__).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    chartType = Unicode('line-chart').tag(sync=True)
    data = Any().tag(sync=True, **widget_serialization)
    ordinalAccessor = Unicode('label').tag(sync=True)
    valueAccessor = Unicode('value').tag(sync=True)
    seriesAccessor = Unicode().tag(sync=True)
    mainTitle = Unicode().tag(sync=True)
    subTitle = Unicode().tag(sync=True)
    accessibility = Dict().tag(sync=True, **widget_serialization)
    config = Dict().tag(sync=True, **widget_serialization)

    @validate('data')
    def _validate_data(self, proposal):
        if isinstance(proposal.value, pd.DataFrame):
            return proposal.value.to_dict('records')
        elif isinstance(proposal.value, list):
            return proposal.value
        else:
            raise ValueError('Expecting a DataFrame or List, got {}'.format(type(proposal.value)))

@widgets.register
class PieChart(widgets.DOMWidget):
    """A pie-chart widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode(view_name).tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode(model_name).tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode(_module).tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode(_module).tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode(__version__).tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode(__version__).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    chartType = Unicode('pie-chart').tag(sync=True)
    data = List().tag(sync=True, **widget_serialization)
    ordinalAccessor = Unicode('label').tag(sync=True)
    valueAccessor = Unicode('value').tag(sync=True)
    mainTitle = Unicode().tag(sync=True)
    subTitle = Unicode().tag(sync=True)
    accessibility = Dict().tag(sync=True, **widget_serialization)
    config = Dict().tag(sync=True, **widget_serialization)

@widgets.register
class ScatterPlot(widgets.DOMWidget):
    """A scatter-plot widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode(view_name).tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode(model_name).tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode(_module).tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode(_module).tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode(__version__).tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode(__version__).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    chartType = Unicode('scatter-plot').tag(sync=True)
    data = Any().tag(sync=True, **widget_serialization)
    xAccessor = Unicode('item').tag(sync=True)
    yAccessor = Unicode('value').tag(sync=True)
    groupAccessor = Unicode('group').tag(sync=True)
    mainTitle = Unicode().tag(sync=True)
    subTitle = Unicode().tag(sync=True)
    accessibility = Dict().tag(sync=True, **widget_serialization)
    config = Dict().tag(sync=True, **widget_serialization)

    @validate('data')
    def _validate_data(self, proposal):
        if isinstance(proposal.value, pd.DataFrame):
            return proposal.value.to_dict('records')
        elif isinstance(proposal.value, list):
            return proposal.value
        else:
            raise ValueError('Expecting a DataFrame or List, got {}'.format(type(proposal.value)))

@widgets.register
class HeatMap(widgets.DOMWidget):
    """A heat-map widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode(view_name).tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode(model_name).tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode(_module).tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode(_module).tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode(__version__).tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode(__version__).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    chartType = Unicode('heat-map').tag(sync=True)
    data = Any().tag(sync=True, **widget_serialization)
    xAccessor = Unicode('date').tag(sync=True)
    yAccessor = Unicode('category').tag(sync=True)
    valueAccessor = Unicode('value').tag(sync=True)
    mainTitle = Unicode().tag(sync=True)
    subTitle = Unicode().tag(sync=True)
    accessibility = Dict().tag(sync=True, **widget_serialization)
    config = Dict().tag(sync=True, **widget_serialization)

    @validate('data')
    def _validate_data(self, proposal):
        if isinstance(proposal.value, pd.DataFrame):
            return proposal.value.to_dict('records')
        elif isinstance(proposal.value, list):
            return proposal.value
        else:
            raise ValueError('Expecting a DataFrame or List, got {}'.format(type(proposal.value)))

@widgets.register
class CirclePacking(widgets.DOMWidget):
    """A circle-packing widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode(view_name).tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode(model_name).tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode(_module).tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode(_module).tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode(__version__).tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode(__version__).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    chartType = Unicode('circle-packing').tag(sync=True)
    data = Any().tag(sync=True, **widget_serialization)
    nodeAccessor = Unicode().tag(sync=True)
    parentAccessor = Unicode().tag(sync=True)
    sizeAccessor = Unicode().tag(sync=True)
    mainTitle = Unicode().tag(sync=True)
    subTitle = Unicode().tag(sync=True)
    accessibility = Dict().tag(sync=True, **widget_serialization)
    config = Dict().tag(sync=True, **widget_serialization)

    @validate('data')
    def _validate_data(self, proposal):
        if isinstance(proposal.value, pd.DataFrame):
            return proposal.value.to_dict('records')
        elif isinstance(proposal.value, list):
            return proposal.value
        else:
            raise ValueError('Expecting a DataFrame or List, got {}'.format(type(proposal.value)))

@widgets.register
class ParallelPlot(widgets.DOMWidget):
    """A parallel-plot widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode(view_name).tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode(model_name).tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode(_module).tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode(_module).tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode(__version__).tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode(__version__).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    chartType = Unicode('parallel-plot').tag(sync=True)
    data = Any().tag(sync=True, **widget_serialization)
    ordinalAccessor = Unicode().tag(sync=True)
    valueAccessor = Unicode().tag(sync=True)
    seriesAccessor = Unicode().tag(sync=True)
    mainTitle = Unicode().tag(sync=True)
    subTitle = Unicode().tag(sync=True)
    accessibility = Dict().tag(sync=True, **widget_serialization)
    config = Dict().tag(sync=True, **widget_serialization)

    @validate('data')
    def _validate_data(self, proposal):
        if isinstance(proposal.value, pd.DataFrame):
            return proposal.value.to_dict('records')
        elif isinstance(proposal.value, list):
            return proposal.value
        else:
            raise ValueError('Expecting a DataFrame or List, got {}'.format(type(proposal.value)))

@widgets.register
class DumbbellPlot(widgets.DOMWidget):
    """A dumbbell-plot widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode(view_name).tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode(model_name).tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode(_module).tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode(_module).tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode(__version__).tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode(__version__).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    chartType = Unicode('dumbbell-plot').tag(sync=True)
    data = Any().tag(sync=True, **widget_serialization)
    ordinalAccessor = Unicode().tag(sync=True)
    valueAccessor = Unicode().tag(sync=True)
    seriesAccessor = Unicode().tag(sync=True)
    mainTitle = Unicode().tag(sync=True)
    subTitle = Unicode().tag(sync=True)
    accessibility = Dict().tag(sync=True, **widget_serialization)
    config = Dict().tag(sync=True, **widget_serialization)

    @validate('data')
    def _validate_data(self, proposal):
        if isinstance(proposal.value, pd.DataFrame):
            return proposal.value.to_dict('records')
        elif isinstance(proposal.value, list):
            return proposal.value
        else:
            raise ValueError('Expecting a DataFrame or List, got {}'.format(type(proposal.value)))

@widgets.register
class WorldMap(widgets.DOMWidget):
    """A world-map widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode(view_name).tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode(model_name).tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode(_module).tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode(_module).tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode(__version__).tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode(__version__).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    chartType = Unicode('world-map').tag(sync=True)
    data = Any().tag(sync=True, **widget_serialization)
    joinAccessor = Unicode().tag(sync=True)
    joinNameAccessor = Unicode().tag(sync=True)
    markerAccessor = Unicode().tag(sync=True)
    markerNameAccessor = Unicode().tag(sync=True)
    latitudeAccessor = Unicode().tag(sync=True)
    longitudeAccessor = Unicode().tag(sync=True)
    valueAccessor = Unicode().tag(sync=True)
    groupAccessor = Unicode().tag(sync=True)
    mainTitle = Unicode().tag(sync=True)
    subTitle = Unicode().tag(sync=True)
    accessibility = Dict().tag(sync=True, **widget_serialization)
    config = Dict().tag(sync=True, **widget_serialization)

    @validate('data')
    def _validate_data(self, proposal):
        if isinstance(proposal.value, pd.DataFrame):
            return proposal.value.to_dict('records')
        elif isinstance(proposal.value, list):
            return proposal.value
        else:
            raise ValueError('Expecting a DataFrame or List, got {}'.format(type(proposal.value)))

@widgets.register
class AlluvialDiagram(widgets.DOMWidget):
    """An alluvial-diagram widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode(view_name).tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode(model_name).tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode(_module).tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode(_module).tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode(__version__).tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode(__version__).tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    chartType = Unicode('alluvial-diagram').tag(sync=True)
    linkData = Any().tag(sync=True, **widget_serialization)
    nodeData = List().tag(sync=True, **widget_serialization)
    sourceAccessor = Unicode().tag(sync=True)
    targetAccessor = Unicode().tag(sync=True)
    valueAccessor = Unicode().tag(sync=True)
    nodeIDAccessor = Unicode().tag(sync=True)
    groupAccessor = Unicode().tag(sync=True)
    mainTitle = Unicode().tag(sync=True)
    subTitle = Unicode().tag(sync=True)
    accessibility = Dict().tag(sync=True, **widget_serialization)
    config = Dict().tag(sync=True, **widget_serialization)

    @validate('linkData')
    def _validate_data(self, proposal):
        if isinstance(proposal.value, pd.DataFrame):
            return proposal.value.to_dict('records')
        elif isinstance(proposal.value, list):
            return proposal.value
        else:
            raise ValueError('Expecting a DataFrame or List, got {}'.format(type(proposal.value)))

