# @visa/keyboard-instructions

![An image depicting an example of the default keyboard-instructions component](./docs/keyboard-instructions-1.png 'Example image of a keyboard instructions component')
<br>

```js
<keyboard-instructions
  uniqueID={this.chartID}
  isCompact
  tableColumns={this.tableColumns}
  data={this.tableData}
  padding={this.padding}
  margin={this.margin}
  hidekeyboardInstructions={this.accessibility.hidekeyboardInstructionsButton}
/>
```

<br>

<details open="open">
  <summary>Jump To:</summary>
  <ol>
    <li>
      <a href="#installation-steps">Installation Steps</a>
    </li>
    <li>
      <a href="#props-documentation">Props Documentation</a>
      <ul>
        <li><a href="#base-props">Keyboard Instructions Props </a></li>
      </ul>
    </li>
  </ol>
</details>
<br>

## <a name="installation-steps">#</a> Installation Steps

---

- Using npm

  ```
  $ npm i @visa/keyboard-instructions
  ```

- Using yarn
  ```
  $ yarn add @visa/keyboard-instructions
  ```

<br>

## <a name="props-documentation">#</a> Props Documentation

---

<br>

### <a name="base-props" href="#base-props">#</a> Keyboard Instructions Props [<>](./src/components/keyboard-instructions/keyboard-instructions.tsx 'Source')

The data-component expects to be utilized within a Visa Chart Component, we do some data preparation in each chart to try and map chart data into a structure that is meaningful for an accompanying keyboard instructions component. Properties for this component are documented below, but you should also refer to a [Visa Chart Component](../bar-chart) to see detail on how this sub-component is leveraged.

| Name                       | Type                 | Default Value(s)                            | Description                                                                                                                                  |
| -------------------------- | -------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `margin`                   | object (custom type) | [IBoxModelType](../types/src/prop-types.ts) | Expects the margin property to be passed from a visa chart components chart. This prop is used to determine button placement, when visible.  |
| `padding`                  | object (custom type) | [IBoxModelType](../types/src/prop-types.ts) | Expects the padding property to be passed from a visa chart components chart. This prop is used to determine button placement, when visible. |
| `isCompact`                | boolean              | false                                       | Set to true by each visa chart component, renders a more compact version of the keyboard instructions component.                             |
| `hidekeyboardInstructions` | boolean              | false                                       | If true, hides the keyboard instructions component button (but it is still available to screen reader users).                                |
| `uniqueID`                 | string               | `undefined`                                 | ID used to identify chart (must be unique per keyboard instructions component), helpful for validation messages. A string must be passed.    |
| `tableColumns`             | string[]             | `undefined`                                 | Populates the column headers of the table, in order.                                                                                         |
| `data`                     | object[]             | `undefined`                                 | Populates the content/rows of the table, data needs to be aligned to `tableColumns` provided.                                                |
| `unitTest`                 | boolean              | false                                       | When set to true, adds testing attributes to the rendered keyboard-instructions components for ease of selection during unit testing.        |

<br>

#### IBoxModelType Definition

| Name     | Type   | Default Value(s) | Description                                             |
| -------- | ------ | ---------------- | ------------------------------------------------------- |
| `top`    | number | height \* 0.01   | Sets the top margin/padding for the chart container.    |
| `bottom` | number | height \* 0.01   | Sets the bottom margin/padding for the chart container. |
| `left`   | number | width \* 0.01    | Sets the top margin/padding for the chart container.    |
| `right`  | number | width \* 0.01    | Sets the top margin/padding for the chart container.    |

<br>
<br>
