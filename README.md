# cesium-mouse
Simple api for adding mouse handlers for Cesium.
 
## Dependencies
 
[EventEmitter3](https://github.com/primus/eventemitter3)
 
## Install
 
```bash
npm i cesium-mouse --save
```
 
## Usage
Import the module:
 
```js
import CesiumMouse from 'cesium-mouse';
```
 
Add the handler for the leftdown event on the canvas element.
Pay attention that the event name must be in lowercase and without the symbol '_'.
 
```js
const mouse = new CesiumMouse(viewer.scene);
mouse.on('leftdown', function(event) { console.log('canvas event', event); });
```
 
To add the leftdown event handler on Entity, you must mix methods [EventEmitter3](https://github.com/primus/eventemitter3) with Entity and set Entity's property 'interactable' value to true.
 
```js
const entity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-80.0, 25.0),
    point: {
        pixelSize: 10,
        color: Cesium.Color.RED
    }
});
CesiumMouse.mixinEventsMethods(entity);
entity.interactable = true;
entity.on('leftdown', function(event) { console.log('entity event', event); });
```
 
List of mouse events name:
* leftdown
* leftclick
* leftup
* leftdoubleclick
* middledown
* middleclick
* middleup
* rightdown
* rightclick
* rightup
* wheel
* mousemove
* mouseover. on the Entity
* mouseout. on the Entity
 
Now you can control the event calling, pointing 'interactable' = false. Also you can subscribe on your own events and call it in any place.
 
```js
entity.on('myownevent', function(event) { console.log('my own event', event); });
entity.emit('myownevent', { foo: 'bar' });
```
 
## License
[MIT](LICENSE)