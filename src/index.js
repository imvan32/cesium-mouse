import EventEmitter from 'eventemitter3';
import {
	ScreenSpaceEventType,
	ScreenSpaceEventHandler,
	Entity
} from 'cesium';

export const formatEventType = nameEvent => nameEvent.toLowerCase().replace(/(_[a-z])/g, $1 => $1.replace('_', ''));

/**
 * Array of objects
 * @typedef pickedObjects
 * @type {object[]} pickedObjects
 * @property {Entity} [pickedObjects[].id] - Entity
 * @property {Primitive} [pickedObjects[].primitive] - Primitive
 */
/**
 * Mouse event
 * @event MouseEvent
 * @type {object}
 * @property {string} eventName - The name of event
 * @property {(Entity|Primitive)} target - The object which call event
 * @property {Cartesian2} windowPosition - Window coordinates
 * @property {pickedObjects} pickedObjects - Array of objects
 */

/**
 * @constructor Mouse
 * @augments EventEmitter
 * @param {Scene} scene
 * @example
 * const mouse = new CesiumMouse(viewer.scene);
 * mouse.on('leftdown', function(event) { console.log(event); });
 */
const Mouse = function (scene) {

	this._scene = scene;
	this._over = null;

	this.handler = new ScreenSpaceEventHandler(this._scene.canvas);

	Object.keys(ScreenSpaceEventType).forEach((eventType) => {

		if (eventType !== 'PINCH_START' && eventType !== 'PINCH_MOVE' && eventType !== 'PINCH_END') {

			this._addEvent(eventType);

		}

	});

};
/**
 * Limit {@link Scene#drillPick}.
 */
Mouse.LIMIT_DRILL_PICK = 10;
/**
 * Mix EventEmitter methods
 * @param {object} - Target object
 * @returns {object} - Produced by mixin
 * @example
 * const mouse = new CesiumMouse(viewer.scene);
 * const entity = viewer.entities.add({ point: {} });
 * CesiumMouse.mixinEventsMethods(entity);
 * entity.interactable = true;
 * entity.on('leftdown', function(event) { console.log(event); });
 */
Mouse.mixinEventsMethods = function (obj) {

	const mixin = Mouse.getEventsMixin();
	Object.keys(mixin).forEach((method) => {

		// eslint-disable-next-line no-param-reassign
		obj[method] = mixin[method];

	});

	return obj;

};
/**
 * Return mixin
 * @returns {object} - Prototype EventEmitter
*/
Mouse.getEventsMixin = function () {

	return EventEmitter.prototype;

};

Mouse.prototype = Object.assign(Object.create(EventEmitter.prototype), {

	constructor: Mouse,
	/**
	 * Destructor
	 * @memberof Mouse.prototype
	 */
	destroy() {

		this.handler.destroy();
		this._scene = null;
		this._over = null;
		this._events = null;

	},
	/**
	 * Add handlers, translating them to lower case and without the character '_'
	 * @memberof Mouse.prototype
	 * @private
	 * @param {string} eventType - ScreenSpaceEventType
	 */
	_addEvent(eventType) {

		this.handler.setInputAction((event) => {

			this._onEvent(formatEventType(eventType), event);

		}, eventType);

	},
	/**
	 * Call a 'global' event
	 * @memberof Mouse.prototype
	 * @private
	 * @param {string} eventName - The name of event
	 * @param {object} event - Event
	 * @fires Mouse#event
	 */
	_onEvent(eventName, event) {

		const windowPosition = event ? (event.endPosition || event.position) : null;
		let pickedObjects = [];
		let target = null;

		if (windowPosition) {

			pickedObjects = this._scene.drillPick(windowPosition, Mouse.LIMIT_DRILL_PICK);
			target = this._getInteractablePrimitive(pickedObjects);

			if (target) {

				this._notify(eventName, target, windowPosition, pickedObjects);

			}

			if (eventName === 'mousemove') {

				this._mouseOverOut(windowPosition, target, pickedObjects);

			}

		}
		this.emit(eventName, {
			windowPosition,
			pickedObjects,
			target,
			type: eventName,
		});

	},

	/**
	 * Find the first object in array, which have interactable = true и show = true
	 * @memberof Mouse.prototype
	 * @private
	 * @param {pickedObjects} pickedObjects - Array of objects
	 * @return {(null|Entity|Primitive)}
	 */
	_getInteractablePrimitive(pickedObjects) {

		let primitive = null;

		for (let i = 0, l = pickedObjects.length; i < l; i++) {

			const data = pickedObjects[i];
			const object = data.id instanceof Entity ? data.id : data.primitive;
			if (object.interactable && object.show) {

				primitive = object;
				break;

			}

		}

		return primitive;

	},

	/**
	 * Call the event on the passed object
	 * @memberof Mouse.prototype
	 * @private
	 * @param {string} eventName - The name of event
	 * @param {(Entity|Primitive)} target - The object which call event
	 * @param {Cartesian2} windowPosition - Window coordinates
	 * @param {pickedObjects} pickedObjects - Array of objects
	 * @fires Mouse#event
	 */
	_notify(eventName, target, windowPosition, pickedObjects) {

		target.emit(eventName, {
			windowPosition,
			pickedObjects,
			target,
			type: eventName,
		});

	},
	/**
	 * Checks the mouse hover on the object {@link Mouse#_notify}
	 * @memberof Mouse.prototype
	 * @private
	 * @param {Cartesian2} windowPosition - Window coordinates
	 * @param {(Entity|Primitive|null)} picked - Target object
	 * @param {pickedObjects} pickedObjects - Array of objects
	 */
	_mouseOverOut(windowPosition, picked, pickedObjects) {

		const oldSelected = this._over;
		const newSelected = picked;
		let notifyOver = false;
		let notifyOut = false;

		if (picked) {

			this._over = newSelected;

			if (oldSelected !== newSelected) {

				notifyOver = true;
				notifyOut = oldSelected !== null;

			}

		} else {

			notifyOut = oldSelected !== null;
			this._over = null;

		}


		notifyOver && this._notify('mouseover', newSelected, windowPosition, pickedObjects);
		notifyOut && this._notify('mouseout', oldSelected, windowPosition, pickedObjects);

	}

});

export default Mouse;
