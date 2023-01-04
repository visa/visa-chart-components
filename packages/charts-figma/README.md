# @visa/charts-figma

This package bundles [visa chart components](../../) and provides them to [Figma](https://www.figma.com) users/designers by way of a plugin. We leverage [stencil's react bindings](https://stenciljs.com/docs/framework-bindings) in the creation of @visa/charts-figma.

---

### Running the Figma plugin locally in development mode

_note: the initial install and build process can take some time._

- Clone the repo
- run `yarn install`
- run `yarn dev --i` to install the monorepo
- run `yarn dev --b` to build the packages across the monorepo
- run `yarn dev --sf` to run the plugin OR `yarn build --scope=@visa/charts-figma` to build the plugin
- In the Figma Desktop App go to the Plugins Menu > Development > Manage Plugins in development
- Click the + and select "import plugin from manifest"
- Navigate to your cloned folder and select the "packages/charts-figma/manifest.json" and click "Open".
- You should see a message that says "Visa Chart Components has been imported"
- To run the plugin, go back to the Plugin Menu > Development > Select "Visa Chart Components" and the plugin will run.

<br />

#### Components with `Ready` status included in the plugin

- [@visa/bar-chart](../bar-chart)
- [@visa/clustered-bar-chart](../clustered-bar-chart)
- [@visa/stacked-bar-chart](../stacked-bar-chart)
- [@visa/line-chart](../line-chart)
- [@visa/pie-chart](../pie-chart)
- [@visa/scatter-plot](../scatter-plot)
- [@visa/heat-map](../heat-map)
- [@visa/circle-packing](../circle-packing)
- [@visa/parallel-plot](../parallel-plot)
- [@visa/world-map](../world-map)
- [@visa/alluvial-diagram](../alluvial-diagram)

<!-- #### Components with `Development` status -->
<br />
<hr>
<br />

#### <a name="figma_components" href="#figma_components">#</a> Using VCC in Figma

<br />

Step 1: Open Figma Desktop and add Visa Chart Components plugin (see steps above)

Step 2: Run the plugin in Figma

Step 3: Select a chart type by clicking on its respective card.

![Screen one of the VCC figma plugin with chart types presented in cards for selection.](docs/figma-plugin-screen-1.png 'vcc figma plugin select chart type screen')

Step 4: Select a chart style by clicking on its respective card.

![Screen two of the VCC figma plugin with chart styles presented in cards for selection.](docs/figma-plugin-screen-2.png 'vcc figma plugin select chart style screen')

Step 5: Randomize data, interact with chart to change state and create in Figma. Create many charts if needed.

![Screen three of the VCC figma plugin with chart and options.](docs/figma-plugin-screen-3.png 'vcc figma plugin customize chart screen')

Step 5a: Close plugin when chart creations are completed

Step 6: Continue your design work with charts made directly with Figma nodes.

![Screen of Figma, showing a bar chart and its node make up.](docs/figma-plugin-screen-4.png 'figma screen with bar chart frame')

In addition to the core project team, special thanks to Skyler Knight ([personal](https://github.com/skylerknight)) for his assistance in development the VCC Figma plugin.
