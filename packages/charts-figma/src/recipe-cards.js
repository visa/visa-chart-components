/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import React from 'react';
import { useState, useLayoutEffect } from 'react';
import recipe_json from './data/recipe-data.json';
import DisplayChart from './DisplayChart';

const RecipeCards = props => {
  const [preppedData, setPreppedData] = useState([]);

  useLayoutEffect(() => {
    setPreppedData(recipe_json.filter(rec => rec.chart === props.chart && rec.name !== 'Hidden'));
  }, []);

  const cardCallback = (_, recipe) => {
    // console.log('card has been clicked', recipe, e);
    props.level2Callback(recipe);
  };

  return (
    (preppedData && preppedData.length && (
      <div className="row">
        {preppedData.map(recipe => {
          // console.log('recipe', recipe.name, props.chart);
          const chartTitle = recipe.name.replace(/-/g, ' ');
          return (
            <div className="col" key={`${props.chart}-${recipe.name}`}>
              <button className="gallery-card" onClick={e => cardCallback(e, recipe)} type="button">
                <div>
                  <DisplayChart chartType={props.chart} recipe={recipe} />
                  <h3 className="card-title">{chartTitle}</h3>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    )) ||
    null
  );
};

export default RecipeCards;
