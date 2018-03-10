# cesium-mouse
Предоставляет удобное API для подписки на события мыши в Cesium.

```js
const mouse = new CesiumMouse(viewer.scene);
mouse.on('leftdown', function(event) { console.log('canvas event', event); });
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

## Install

```bash
npm i cesium-mouse --save
```