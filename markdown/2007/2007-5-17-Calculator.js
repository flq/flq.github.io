import React, { useState, useEffect, useCallback } from "react";

export function Calculator() {

  const [values, setValues] = useState({ k1: 12, k2: 12, v1: 4, v2: 2, x: 0.8 })
  const [results, setResults] = useState({ ttotal: 0, bestx: 0, tbest: 0 })

  const update = useCallback((key, value) => {
    let num = parseFloat(value);
    if (isNaN(num)) {
      num = 0;
    }
    setValues(v => ({ ...v, [key]: num }));
  },[])

  useEffect(() => {
    const i = values;
    const z = i.v2/i.v1;
    const r = i.k2/i.k1;

    const calcT = (x) => ((i.k1*x)/i.v1)+(Math.sqrt(Math.pow(1-x,2)+Math.pow(i.k2,2))/i.v2)
    const bestx = 1+(z*Math.sqrt(Math.pow(r,2)*(1-Math.pow(z,2))))/(Math.pow(z,2) - 1)

    setResults({
      ttotal : calcT(i.x),
      bestx,
      tbest : calcT(bestx)
    });
  }, [values]);

  return (
    <form>
      <div className="row">
        <div className="six columns">
          <label htmlFor="K1">K1 in metres</label>
          <input 
            className="u-full-width"
            value={values.k1}
            onChange={(e) => update("k1", e.target.value)} 
            type="text"
            aria-label="K1"
            placeholder="K1" 
            id="K1" />
        </div>
        <div className="six columns">
          <label htmlFor="K2">K2 in metres</label>
          <input className="u-full-width" 
            value={values.k2}
            onChange={(e) => update("k2", e.target.value)}
            type="text" 
            placeholder="K2" 
            aria-label="K2" 
            id="K2" />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <label htmlFor="v1">v1 in metres / second</label>
          <input className="u-full-width"
            value={values.v1} 
            onChange={(e) => {
              update("v1", e.target.value);
            }}
            type="text" 
            placeholder="v1" 
            aria-label="v1" 
            id="v1" />
        </div>
        <div className="six columns">
          <label htmlFor="v2">v2 in metres / second</label>
          <input className="u-full-width"
            value={values.v2} 
            onChange={(e) => update("v2", e.target.value)}
            type="text" 
            placeholder="v2" 
            aria-label="v2" 
            id="v2" />
        </div>
      </div>
      <div className="row">
        <div className="six columns">
          <label htmlFor="x">x (x*k1 between 0 and 1)</label>
          <input className="u-full-width"
            value={values.x}
            onChange={(e) => update("x", e.target.value)} 
            type="text" 
            placeholder="x" 
            aria-label="x" 
            id="x" />
        </div>
      </div>
      <div className="row">
        <div className="twelve columns">
          <p>{`In this scenario, it takes ${results.ttotal.toFixed(3)} seconds to get to the object. Ideally you would jump in at an x of ${results.bestx.toFixed(3)}. Then it would take you ${results.tbest.toFixed(3)} seconds.`}</p>
        </div>
      </div>
    </form>
  );
}