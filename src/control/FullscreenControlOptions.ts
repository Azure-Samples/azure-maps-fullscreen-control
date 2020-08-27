import * as azmaps from "azure-maps-control";

/** Options for the FullscreenControlOptions. */
export interface FullscreenControlOptions {

    /**
    * The style of the control. Can be; light, dark, auto, or any CSS3 color. When set to auto, the style will change based on the map style.
    * Default `light'.
    * @default light
    */
    style?: azmaps.ControlStyle | string;

    /**
     * Specifies if the control should be hidden if fullscreen is not supported by the browser. 
     * @default false
     */
    hideIfUnsupported?: boolean;

    /**
     * The HTML element that should be made fullscreen. If not specified, the map container element will be used. 
     * If a string is passed in, it will first be used with `document.getElementById` and if null, will then use `document.querySelector`.
     */
    container?: string | HTMLElement;
}