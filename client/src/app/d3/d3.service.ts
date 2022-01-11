import { Injectable, EventEmitter } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class D3Service {

  constructor() { }

  /** A method to bind a pan and zoom behaviour to an svg element */
  applyZoomableBehaviour(svgElement, containerElement) {
    let svg, container, zoomed, zoom;

    svg = d3.select(svgElement);
    container = d3.select(containerElement);

    zoomed = () => {
      const transform = d3.event.transform;
      container.attr("transform", "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")");
    }

    zoom = d3.zoom().on("zoom", zoomed);
    svg.call(zoom);
  }
}
