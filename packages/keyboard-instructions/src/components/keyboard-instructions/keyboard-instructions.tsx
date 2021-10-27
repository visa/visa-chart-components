/**
 * Copyright (c) 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Prop, Element, State, h, Watch } from '@stencil/core';
import { KeyboardInstructionsDefaultValues } from './keyboard-instructions-default-values';
import Utils from '@visa/visa-charts-utils';

const { getLicenses } = Utils;

@Component({
  tag: 'keyboard-instructions',
  styleUrl: 'keyboard-instructions.scss'
})
export class KeyboardInstructions {
  // basic props for the table
  @Prop({ mutable: true }) uniqueID: string;
  @Prop({ mutable: true }) geomType: string = KeyboardInstructionsDefaultValues.geomType;
  @Prop({ mutable: true }) groupName: string = KeyboardInstructionsDefaultValues.groupName;
  @Prop({ mutable: true }) chartTag: string = KeyboardInstructionsDefaultValues.chartTag;
  @Prop({ mutable: true }) width: number | string = KeyboardInstructionsDefaultValues.width;
  @Prop({ mutable: true }) isInteractive: boolean = KeyboardInstructionsDefaultValues.isInteractive;
  @Prop({ mutable: true }) hasCousinNavigation: boolean = KeyboardInstructionsDefaultValues.hasCousinNavigation;
  @Prop({ mutable: true }) cousinActionOverride: string = KeyboardInstructionsDefaultValues.cousinActionOverride;
  @Prop({ mutable: true }) cousinResultOverride: string = KeyboardInstructionsDefaultValues.cousinResultOverride;
  @Prop({ mutable: true }) disabled: boolean = KeyboardInstructionsDefaultValues.disabled;

  // debugging props
  @Prop({ mutable: true }) unitTest: boolean = KeyboardInstructionsDefaultValues.unitTest;

  // state for showing the tablex
  @State() showInstructions: boolean = false;
  @State() showHeading: boolean = false;
  innerWidth: number = 300;

  // Element
  @Element()
  keyboardInstructionsEl: HTMLElement;

  @Watch('width')
  widthWatcher(_new, _old) {
    this.innerWidth = Math.min(Math.max(parseFloat(_new + ''), 250), 450);
  }

  componentWillLoad() {
    this.innerWidth = Math.min(Math.max(parseFloat(this.width + ''), 250), 450);
  }

  componentWillUpdate() {
    this.init();
  }

  componentDidLoad() {}

  componentDidUpdate() {}

  cousinAction = () => {
    return this.hasCousinNavigation
      ? !this.cousinActionOverride
        ? 'on a ' + this.groupName + ' or ' + this.geomType
        : this.cousinActionOverride
      : 'are unused';
  };

  cousinResult = () => {
    return this.hasCousinNavigation
      ? !this.cousinResultOverride
        ? 'Move among ' + this.geomType + 's across ' + this.groupName + 's'
        : this.cousinResultOverride
      : 'No effect on this chart';
  };

  instructionsMenu = () => {
    if (this.showInstructions) {
      return (
        <div>
          <p>
            Note: for VoiceOver users (mac), press and hold <kbd>Ctrl</kbd> + <kbd>Shift</kbd> when using the arrow keys
            for the best navigation experience.
          </p>
          <table
            class="vcc-ki-keyboard-instructions vcc-ki-data-table vcc-ki-state--single-select vcc-ki-state--compact"
            data-header="header"
          >
            <thead class="vcc-ki-thead">
              <tr class="vcc-ki-tr">
                <th class="vcc-ki-th" scope="col">
                  Action
                </th>
                <th class="vcc-ki-th" scope="col">
                  Result
                </th>
              </tr>
            </thead>
            <tbody class="vcc-ki-tbody">
              <tr class="vcc-ki-tr">
                <th scope="row" class="vcc-ki-td">
                  <kbd>Enter</kbd> on the chart area or a {this.groupName}.
                </th>
                <td class="vcc-ki-td">Enter the chart area/drill down a level.</td>
              </tr>
              <tr class="vcc-ki-tr">
                <th scope="row" class="vcc-ki-td">
                  <kbd>Esc</kbd> on a {this.groupName} or {this.geomType}.
                </th>
                <td class="vcc-ki-td">Drill up a level.</td>
              </tr>
              <tr class="vcc-ki-tr">
                <th scope="row" class="vcc-ki-td">
                  <kbd>Tab</kbd> at any time.
                </th>
                <td class="vcc-ki-td">Exit the chart.</td>
              </tr>
              <tr class={this.isInteractive ? 'vcc-ki-tr' : 'vcc-ki-tr vcc-ki-disabled-row'}>
                <th scope="row" class="vcc-ki-td">
                  <kbd>Space</kbd> {this.isInteractive ? 'on a ' + this.geomType : 'is unused'}.
                </th>
                <td class="vcc-ki-td">
                  {this.isInteractive ? 'Select/Deselect a ' + this.geomType : 'No effect on this chart'}.
                </td>
              </tr>
              <tr class="vcc-ki-tr">
                <th scope="row" class="vcc-ki-td">
                  <kbd>←</kbd> / <kbd>→</kbd> on a {this.groupName} or {this.geomType}.
                </th>
                <td class="vcc-ki-td">
                  Move among sibling {this.groupName}s or {this.geomType}s.
                </td>
              </tr>
              <tr class={this.hasCousinNavigation ? 'vcc-ki-tr' : 'vcc-ki-tr vcc-ki-disabled-row'}>
                <th scope="row" class="vcc-ki-td">
                  <kbd>↑</kbd> / <kbd>↓</kbd> {this.cousinAction()}.
                </th>
                <td class="vcc-ki-td">{this.cousinResult()}.</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  };

  render() {
    if (this.disabled) {
      return;
    }
    const svgProps = { tabindex: '-1' };
    const useProps = {
      href: `#visa-viz-keyboard-instructions-info--tiny-${this.uniqueID}`,
      xlinkHref: `#visa-viz-keyboard-instructions-info--tiny-${this.uniqueID}`
    };
    const symbolProps = { viewbox: '0 0 16 16' };
    return (
      <div class="vcc-ki-keyboard-instructions-root" style={{ position: 'relative', width: `${this.width}px` }}>
        <div
          class={
            this.showHeading || this.showInstructions
              ? 'visa-viz-keyboard-instructions-outer-container vcc-ki-bordered'
              : 'visa-viz-keyboard-instructions-outer-container'
          }
          data-testid={this.unitTest ? 'keyboard-instructions-outer-container' : null}
          style={{ width: `${this.innerWidth - 34}px` }}
        >
          <div
            class={
              this.showHeading || this.showInstructions
                ? 'vcc-ki-keyboard-instructions-header'
                : 'vcc-ki-keyboard-instructions-header vcc-ki-minimize'
            }
          >
            <p class="vcc-ki-keyboard-heading">
              {this.showInstructions ? 'Keyboard Instructions' : 'Select to View Keyboard Instructions'}
            </p>
          </div>
          <div class="visa-viz-keyboard-instructions-button-wrapper">
            <button
              id={`visa-viz-keyboard-instructions-button-${this.uniqueID}`}
              type="button"
              class="vcc-ki-btn-icon vcc-ki-btn-icon--light-tiny visa-viz-keyboard-instructions-button"
              aria-label={this.showInstructions ? 'close keyboard instructions' : 'display keyboard instructions'}
              aria-expanded={this.showInstructions ? 'true' : 'false'}
              role="button"
              tabIndex={0}
              onClick={() => {
                this.showInstructions = !this.showInstructions;
                this.showHeading = false;
              }}
              onFocus={() => (this.showHeading = true)}
              onBlur={() => (this.showHeading = this.showInstructions)}
            >
              <svg class="vcc-ki-icon--tiny" focusable="false" {...svgProps}>
                <use {...useProps} />
              </svg>
            </button>
            <svg class="vcc-ki-icons">
              <symbol id={`visa-viz-keyboard-instructions-info--tiny-${this.uniqueID}`} {...symbolProps}>
                {this.showInstructions ? (
                  <path d="M9.41,8l5.3,5.29a1,1,0,0,1-1.42,1.42L8,9.41l-5.29,5.3a1,1,0,0,1-1.42-1.42L6.59,8,1.29,2.71A1,1,0,0,1,2.71,1.29L8,6.59l5.29-5.3a1,1,0,1,1,1.42,1.42Z" />
                ) : (
                  <path d="M8.7,3.8a.68.68,0,0,1,.7.7.79.79,0,0,1-.8.8H8.5c-.4,0-.6-.3-.6-.7A.79.79,0,0,1,8.7,3.8ZM6.6,12.1l1.2-6H9l-1.2,6ZM14,8a6,6,0,1,0-6,6A6,6,0,0,0,14,8Zm2,0A8,8,0,1,1,8,0,8,8,0,0,1,16,8Z" />
                )}
              </symbol>
            </svg>
          </div>
          <div
            id={`visa-viz-keyboard-instructions-container-${this.uniqueID}`}
            class="visa-viz-keyboard-instructions-container"
            data-testid={this.unitTest ? 'keyboard-instructions-container' : null}
          >
            {this.instructionsMenu()}
          </div>
        </div>
      </div>
    );
  }
  private init() {
    // reading properties
    const keys = Object.keys(KeyboardInstructionsDefaultValues);
    let i = 0;
    const exceptions = {};
    for (i = 0; i < keys.length; i++) {
      const exception = !exceptions[keys[i]] ? false : this[keys[i]] === exceptions[keys[i]].exception;
      this[keys[i]] = this[keys[i]] || exception ? this[keys[i]] : KeyboardInstructionsDefaultValues[keys[i]];
    }
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
