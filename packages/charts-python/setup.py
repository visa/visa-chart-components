# /**
# * Copyright (c) 2022, 2023 Visa, Inc.
# *
# * This source code is licensed under the MIT license
# * https://github.com/visa/visa-chart-components/blob/master/LICENSE
# *
# **/
from __future__ import print_function
from setuptools import setup, find_packages
import os
from os.path import join as pjoin
from distutils import log
from pathlib import Path

from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    combine_commands,
    get_version,
)


name = 'pyvisacharts'
here = os.path.dirname(os.path.abspath(__file__))
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text()

log.set_verbosity(log.DEBUG)
log.info('setup.py entered')
log.info('$PATH=%s' % os.environ['PATH'])

# Get pyvisacharts version
version = get_version(pjoin(name, '_version.py'))

js_dir = pjoin(here, 'js')

# Representative files that should exist after a successful build
jstargets = [
    pjoin('pyvisacharts', 'nbextension', 'index.js'),
    pjoin('pyvisacharts', 'labextension', 'package.json'),
]

data_files_spec = [
    ('share/jupyter/nbextensions/@visa/charts-python',
     'pyvisacharts/nbextension', '*.*'),
    ('share/jupyter/labextensions/@visa/charts-python',
     'pyvisacharts/labextension', '**'),
    ('share/jupyter/labextensions/@visa/charts-python', '.', 'install.json'),
    ('etc/jupyter/nbconfig/notebook.d', '.', 'charts-python.json'),
]

cmdclass = create_cmdclass('jsdeps', data_files_spec=data_files_spec)
cmdclass['jsdeps'] = combine_commands(
    install_npm(js_dir, npm=['yarn'],
                build_cmd='build'), ensure_targets(jstargets),
)

setup_args = dict(
    name=name,
    version=version,
    description='A Jupyter Widget for Visa Chart Components',
    long_description=long_description,
    long_description_content_type='text/markdown',
    license="SEE LICENSE IN LICENSE",
    url="https://github.com/visa/visa-chart-components/tree/main/packages/charts-python",
    project_urls={
        "Bug Reports": "https://github.com/visa/visa-chart-components/issues",
        "Source": "https://github.com/visa/visa-chart-components/tree/main/packages/charts-python",
        "Storybook Demo": "https://visa.github.io/visa-chart-components/",
        "Visa Chart Components": "https://github.com/visa/visa-chart-components"
    },
    author='Visa Data Experience Team',
    include_package_data=True,
    install_requires=[
        'ipywidgets>=7.6.0',
    ],
    packages=find_packages(),
    zip_safe=False,
    cmdclass=cmdclass,
    keywords=[
        'ipython',
        'jupyter',
        'widgets',
        'visa',
        'charts',
        'visualization',
        'viz',
        'accessibility',
        'a11y',
        'd3'
    ],
    classifiers=[
        'Development Status :: 4 - Beta',
        'Framework :: IPython',
        'Intended Audience :: Developers',
        'Intended Audience :: Science/Research',
        'Topic :: Multimedia :: Graphics',
        "License :: OSI Approved :: MIT License",
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
    ],
)

setup(**setup_args)
