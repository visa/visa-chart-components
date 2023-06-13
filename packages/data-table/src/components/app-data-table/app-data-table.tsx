/**
 * Copyright (c) 2020, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Element, h } from '@stencil/core';

@Component({
  tag: 'app-data-table',
  styleUrl: 'app-data-table.scss'
})
export class AppDataTable {
  @State() language: string = 'en';
  @State() data: any = [];
  @State() hoverElement: any = '';
  @State() clickElement: any = [];

  @Element()
  appEl: HTMLElement;

  componentWillUpdate() {
    // console.log('will update', this.clickElement);
  }
  onClickFunc(d) {
    this.clickElement = [d];
  }
  onHoverFunc(d) {
    this.hoverElement = d;
  }
  onMouseOut() {
    this.hoverElement = '';
  }

  render() {
    console.log('!!!!app re-render');
    return (
      <div>
        <br />
        <br />
        <br />
        <data-table
          isCompact
          uniqueID="table-1"
          language={'en'}
          data={[
            { country: 'China', value: '30', region: 'Asia' },
            { country: 'Japan', value: '10', region: 'Asia' },
            { country: 'Thailand', value: '30', region: 'Asia' },
            { country: 'United States', value: '114', region: 'North America' },
            { country: 'Canada', value: '24', region: 'North America' },
            { country: 'India', value: '21', region: 'Asia' },
            { country: 'Indonesia', value: '111', region: 'Asia' },
            { country: 'Germany', value: '38', region: 'Europe' },
            { country: 'Turkey', value: '28', region: 'Europe' },
            { country: 'Italy', value: '16', region: 'Europe' },
            { country: 'China', value: '30', region: 'Asia' },
            { country: 'Japan', value: '10', region: 'Asia' },
            { country: 'Thailand', value: '30', region: 'Asia' },
            { country: 'United States', value: '114', region: 'North America' },
            { country: 'Canada', value: '24', region: 'North America' },
            { country: 'India', value: '21', region: 'Asia' },
            { country: 'Indonesia', value: '111', region: 'Asia' },
            { country: 'Germany', value: '38', region: 'Europe' },
            { country: 'Turkey', value: '28', region: 'Europe' },
            { country: 'Italy', value: '16', region: 'Europe' },
            { country: 'China', value: '30', region: 'Asia' },
            { country: 'Japan', value: '10', region: 'Asia' },
            { country: 'Thailand', value: '30', region: 'Asia' }
          ]}
        />
        <br />
        <br />
        <br />
        <br />
        <data-table
          isCompact
          uniqueID="table-2"
          data={[
            { ID: 1, Name: 'Angola', 'Birth Rate': 14.2, 'Country Code': '024' },
            { ID: 2, Name: 'Niger', 'Birth Rate': 44.2, 'Country Code': '562' },
            { ID: 3, Name: 'Mali', 'Birth Rate': 43.9, 'Country Code': '466' },
            { ID: 4, Name: 'Uganda', 'Birth Rate': 42.9, 'Country Code': '800' },
            { ID: 5, Name: 'Zambia', 'Birth Rate': 41.5, 'Country Code': '894' },
            { ID: 6, Name: 'Burundi', 'Birth Rate': 41.3, 'Country Code': '108' },
            { ID: 7, Name: 'Burkina Faso', 'Birth Rate': 41.2, 'Country Code': '854' },
            { ID: 8, Name: 'Malawi', 'Birth Rate': 41, 'Country Code': '454' },
            { ID: 9, Name: 'Somalia', 'Birth Rate': 39.6, 'Country Code': '706' },
            { ID: 10, Name: 'Liberia', 'Birth Rate': 38.3, 'Country Code': '430' },
            { ID: 11, Name: 'Mozambique', 'Birth Rate': 38.1, 'Country Code': '508' },
            { ID: 12, Name: 'Afghanistan', 'Birth Rate': 37.9, 'Country Code': '004' },
            { ID: 13, Name: 'Nigeria', 'Birth Rate': 36.9, 'Country Code': '566' },
            { ID: 14, Name: 'Ethiopia', 'Birth Rate': 36.5, 'Country Code': '231' },
            { ID: 15, Name: 'Sierra Leone', 'Birth Rate': 36.3, 'Country Code': '694' },
            { ID: 16, Name: 'Tanzania', 'Birth Rate': 35.6, 'Country Code': '834' },
            { ID: 17, Name: 'Chad', 'Birth Rate': 35.6, 'Country Code': '148' },
            { ID: 18, Name: 'South Sudan', 'Birth Rate': 35.5, 'Country Code': '728' },
            { ID: 19, Name: 'Cameroon', 'Birth Rate': 35.4, 'Country Code': '120' },
            { ID: 20, Name: 'Guinea', 'Birth Rate': 35.1, 'Country Code': '324' },
            { ID: 21, Name: 'Benin', 'Birth Rate': 35, 'Country Code': '204' },
            { ID: 22, Name: 'Congo, Republic of the', 'Birth Rate': 34.4, 'Country Code': '178' },
            { ID: 23, Name: 'Central African Republic', 'Birth Rate': 34.3, 'Country Code': '140' },
            { ID: 24, Name: 'Gabon', 'Birth Rate': 34.2, 'Country Code': '266' },
            { ID: 25, Name: 'Zimbabwe', 'Birth Rate': 34.2, 'Country Code': '716' },
            { ID: 26, Name: 'Congo, Democratic Republic of the', 'Birth Rate': 33.5, 'Country Code': '180' },
            { ID: 27, Name: 'Timor-Leste', 'Birth Rate': 33.4, 'Country Code': '626' },
            { ID: 28, Name: 'Senegal', 'Birth Rate': 33.4, 'Country Code': '686' },
            { ID: 29, Name: 'Togo', 'Birth Rate': 33.3, 'Country Code': '768' },
            { ID: 30, Name: 'Guinea-Bissau', 'Birth Rate': 32.5, 'Country Code': '624' },
            { ID: 31, Name: 'Sao Tome and Principe', 'Birth Rate': 32.4, 'Country Code': '678' },
            { ID: 32, Name: 'Equatorial Guinea', 'Birth Rate': 32.2, 'Country Code': '226' },
            { ID: 33, Name: 'Madagascar', 'Birth Rate': 31.6, 'Country Code': '450' },
            { ID: 35, Name: 'Rwanda', 'Birth Rate': 30.7, 'Country Code': '646' },
            { ID: 36, Name: 'Ghana', 'Birth Rate': 30.5, 'Country Code': '288' },
            { ID: 37, Name: 'Iraq', 'Birth Rate': 30.4, 'Country Code': '368' },
            { ID: 38, Name: 'Mauritania', 'Birth Rate': 30.4, 'Country Code': '478' },
            { ID: 39, Name: 'Eritrea', 'Birth Rate': 29.6, 'Country Code': '232' },
            { ID: 40, Name: 'Egypt', 'Birth Rate': 29.6, 'Country Code': '818' },
            { ID: 41, Name: 'Gambia, The', 'Birth Rate': 29.4, 'Country Code': '270' },
            { ID: 42, Name: 'Western Sahara', 'Birth Rate': 29.3, 'Country Code': '732' },
            { ID: 43, Name: 'Yemen', 'Birth Rate': 28.4, 'Country Code': '887' },
            { ID: 44, Name: 'Sudan', 'Birth Rate': 27.9, 'Country Code': '729' },
            { ID: 46, Name: 'Namibia', 'Birth Rate': 27.3, 'Country Code': '516' },
            { ID: 49, Name: 'Solomon Islands', 'Birth Rate': 24.9, 'Country Code': '090' },
            { ID: 50, Name: 'Lesotho', 'Birth Rate': 24.6, 'Country Code': '426' },
            { ID: 52, Name: 'Guatemala', 'Birth Rate': 24.1, 'Country Code': '320' },
            { ID: 53, Name: 'Belize', 'Birth Rate': 24, 'Country Code': '084' },
            { ID: 54, Name: 'Oman', 'Birth Rate': 24, 'Country Code': '512' },
            { ID: 56, Name: 'Nauru', 'Birth Rate': 24, 'Country Code': '520' },
            { ID: 57, Name: 'Vanuatu', 'Birth Rate': 24, 'Country Code': '548' },
            { ID: 58, Name: 'Jordan', 'Birth Rate': 23.9, 'Country Code': '400' },
            { ID: 59, Name: 'Kenya', 'Birth Rate': 23.9, 'Country Code': '404' },
            { ID: 60, Name: 'Papua New Guinea', 'Birth Rate': 23.7, 'Country Code': '598' },
            { ID: 62, Name: 'Tuvalu', 'Birth Rate': 23.7, 'Country Code': '798' },
            { ID: 64, Name: 'Djibouti', 'Birth Rate': 23.4, 'Country Code': '262' },
            { ID: 65, Name: 'Tajikistan', 'Birth Rate': 23.3, 'Country Code': '762' },
            { ID: 66, Name: 'Haiti', 'Birth Rate': 23, 'Country Code': '332' },
            { ID: 67, Name: 'Cambodia', 'Birth Rate': 23, 'Country Code': '116' },
            { ID: 68, Name: 'Honduras', 'Birth Rate': 22.4, 'Country Code': '340' },
            { ID: 69, Name: 'Algeria', 'Birth Rate': 22.2, 'Country Code': '012' },
            { ID: 70, Name: 'Tonga', 'Birth Rate': 22.2, 'Country Code': '776' },
            { ID: 71, Name: 'Botswana', 'Birth Rate': 22.1, 'Country Code': '072' },
            { ID: 72, Name: 'Kyrgyzstan', 'Birth Rate': 22.1, 'Country Code': '417' },
            { ID: 74, Name: 'Pakistan', 'Birth Rate': 21.9, 'Country Code': '586' },
            { ID: 76, Name: 'Kiribati', 'Birth Rate': 21.2, 'Country Code': '296' },
            { ID: 77, Name: 'Samoa', 'Birth Rate': 20.4, 'Country Code': '882' },
            { ID: 78, Name: 'South Africa', 'Birth Rate': 20.2, 'Country Code': '710' },
            { ID: 80, Name: 'Micronesia, Federated States of', 'Birth Rate': 20, 'Country Code': '583' },
            { ID: 81, Name: 'Guam', 'Birth Rate': 19.7, 'Country Code': '316' },
            { ID: 82, Name: 'American Samoa', 'Birth Rate': 19.6, 'Country Code': '016' },
            { ID: 83, Name: 'Nepal', 'Birth Rate': 19.5, 'Country Code': '524' },
            { ID: 84, Name: 'Kuwait', 'Birth Rate': 19.2, 'Country Code': '414' },
            { ID: 85, Name: 'Malaysia', 'Birth Rate': 19.1, 'Country Code': '458' },
            { ID: 86, Name: 'Turkmenistan', 'Birth Rate': 19.1, 'Country Code': '795' },
            { ID: 87, Name: 'India', 'Birth Rate': 19, 'Country Code': '356' }
          ]}
        />
      </div>
    );
  }
}
