# /**
# * Copyright (c) 2022, 2023 Visa, Inc.
# *
# * This source code is licensed under the MIT license
# * https://github.com/visa/visa-chart-components/blob/master/LICENSE
# *
# **/
# Module version
version_info = (2, 1, 0, 'final', 0)

# Module version stage suffix map
_specifier_ = {'alpha': 'a', 'beta': 'b', 'candidate': 'rc', 'final': ''}

# Module version accessible using pyvisacharts.__version__
__version__ = '%s.%s.%s%s' % (version_info[0], version_info[1], version_info[2],
                              '' if version_info[3] == 'final' else _specifier_[version_info[3]]+str(version_info[4]))
