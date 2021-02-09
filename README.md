---
page_type: sample
description: An Azure Maps Web SDK module that provides a control to display the map in fullscreen mode. 
languages:
- javascript
- typescript
products:
- azure
- azure-maps
---

# Azure Maps Fullscreen Control module

An Azure Maps Web SDK module that provides a control to display the map in fullscreen mode.

Note that not all browsers support fullscreen mode, see https://caniuse.com/#search=fullscreen for a list of current browser versions that support fullscreen mode. By default this control will hide itself if the browser it is loaded in does not support fullscreen mode. You can also use the `FullscreenControl.isSupported` static method to check support programmatically. 

**Samples**

[Fullscreen control](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Fullscreen%20control)
<br/>[<img src="https://github.com/Azure-Samples/AzureMapsCodeSamples/raw/master/AzureMapsCodeSamples/SiteResources/screenshots/Fullscreen-control.jpg" height="200px">](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Fullscreen%20control)

[Fullscreen control options](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Fullscreen%20control%20options)
<br/>[<img src="https://github.com/Azure-Samples/AzureMapsCodeSamples/raw/master/AzureMapsCodeSamples/SiteResources/screenshots/Fullscreen-control-options.jpg" height="200px">](https://azuremapscodesamples.azurewebsites.net/index.html?sample=Fullscreen%20control%20options)

## Getting started

Download the project and copy the `azure-maps-fullscreen-control` JavaScript file from the `dist` folder into your project. 

**Usage**

```JavaScript
//Create an instance of the fullscreen control. By default it will toggle the map in and out of fullscreen mode. 
var fsc = new atlas.control.FullscreenControl({
    style: 'auto',

    //Optionally pass in an HTML element or its ID to have the fullscreen control toggle it in and out of fullscreen mode instead of the map.
    //container: 'myHtmlElement'
});

//Optionally, add events to monitor when the fullscreen mode is entered and exited.
map.events.add('fullscreenchanged', fsc, function(isFullscreen){
    //Do something.
});

//Add the fullscreen control to the map.
map.controls.add(fsc, {
    position: 'top-right'
});
```

You can check to see if the browser supports fullscreen mode by using the static `FullscreenControl.isSupported` method.

```JavaScript
atlas.control.FullscreenControl.isSupported().then(isSupported => {
    //Do something.
});
```

## API Reference

### FullscreenControl class

Implements: `atlas.Control`

Namespace: `atlas.control`

A control that toggles the map or a specific container from its defined size to a fullscreen size.

**Contstructor**

> `FullscreenControl(options?: FullscreenControlOptions)`

**Methods** 

| Name | Return type | Description |
|------|-------------|-------------|
| `dispose()` | | Doisposes the control. |
| `getOptions()` | `FullscreenControlOptions` | Gets the options of the control. |
| `isFullscreen()` | `boolean` | Checks if the map or specified container is in fullscreen mode or not. |
| `setOptions(options: FullscreenControlOptions)` | | Sets the options of the control. |

**Static Methods** 

| Name | Return type | Description |
|------|-------------|-------------|
| `isSupported()` | `Promise<boolean>` | Checks to see if the browser supports going into fullscreen mode. |

**Events**

| Name | Return type | Description |
|------|-------------|-------------|
| `fullscreenchanged` | `boolean` | Event fired when the fullscreen state changed. Returns a boolean indicating if the container is fullscreen or not.  |

### FullscreenControlOptions interface

Options for the FullscreenControl.

**Properties** 

| Name | Type | Description |
|------|------|-------------|
| `container` | `string` \| `HTMLElement` | The HTML element that should be made fullscreen. If not specified, the map container element will be used. If a string is passed in, it will first be used with `document.getElementById` and if null, will then use `document.querySelector`. |
| `hideIfUnsupported` | `boolean` | Specifies if the control should be hidden if fullscreen is not supported by the browser. Default: `false` |
| `style` | `atlas.ControlStyle` \| `string` | The style of the control. Can be; `light`, `dark`, `auto`, or any CSS3 color. When set to auto, the style will change based on the map style. Overridden if device is in high contrast mode. Default `light`. |

## Related Projects

* [Azure Maps Web SDK Open modules](https://github.com/microsoft/Maps/blob/master/AzureMaps.md#open-web-sdk-modules) - A collection of open source modules that extend the Azure Maps Web SDK.
* [Azure Maps Web SDK Samples](https://github.com/Azure-Samples/AzureMapsCodeSamples)
* [Azure Maps Gov Cloud Web SDK Samples](https://github.com/Azure-Samples/AzureMapsGovCloudCodeSamples)
* [Azure Maps & Azure Active Directory Samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples)
* [List of open-source Azure Maps projects](https://github.com/microsoft/Maps/blob/master/AzureMaps.md)

## Additional Resources

* [Azure Maps (main site)](https://azure.com/maps)
* [Azure Maps Documentation](https://docs.microsoft.com/azure/azure-maps/index)
* [Azure Maps Blog](https://azure.microsoft.com/blog/topics/azure-maps/)
* [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-maps.html)
* [Azure Maps feedback](https://feedback.azure.com/forums/909172-azure-maps)

## Contributing

We welcome contributions. Feel free to submit code samples, file issues and pull requests on the repo and we'll address them as we can. 
Learn more about how you can help on our [Contribution Rules & Guidelines](https://github.com/Azure-Samples/azure-maps-fullscreen-control/blob/main/CONTRIBUTING.md). 

You can reach out to us anytime with questions and suggestions using our communities below:
* [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-maps.html)
* [Azure Maps feedback](https://feedback.azure.com/forums/909172-azure-maps)

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). 
For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or 
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## License

MIT
 
See [License](https://github.com/Azure-Samples/azure-maps-fullscreen-control/blob/main/LICENSE.md) for full license text.