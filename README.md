# cesium-mouse
Simple api for adding mouse handlers for Cesium.

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

To add the leftdown event handler on Entity, you must mix methods [EventEmitter3](https://github.com/primus/eventemitter3) with Entity and add for Entity the property 'interactable' equals true.

```js
const entity = viewer.entities.add({
    positon: Cesium.Cartesian3.fromDegrees(-80.0, 25.0),
    point: {
        color: Cesium.Color.RED
    }
});
CesiumMouse.mixinEventsMethods(entity);
entity.interactable = true;
entity.on('leftdown', function(event) { console.log('entity event', event); });
```

In the future, you can control the event calling, pointing 'interactable' = false. Also you can subscribe on your own events and call it in any place.

```js
entity.on('myownevent', function(event) { console.log('my own event', event); });
entity.emit('myownevent', { foo: 'bar' });
```

## License
[MIT](LICENSE)