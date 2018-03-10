import {
	Entity,
	Cartesian2
} from 'cesium';
import EventEmitter from 'eventemitter3';
import CesiumMouse from '../../src';

const mixin = {
	_events: EventEmitter.prototype._events,
	addListener: EventEmitter.prototype.addListener,
	eventNames: EventEmitter.prototype.eventNames,
	listeners: EventEmitter.prototype.listeners,
	once: EventEmitter.prototype.once,
	removeAllListeners: EventEmitter.prototype.removeAllListeners,
	removeListener: EventEmitter.prototype.removeListener,
	setMaxListeners: EventEmitter.prototype.setMaxListeners,
	on: EventEmitter.prototype.on,
	off: EventEmitter.prototype.off,
	emit: EventEmitter.prototype.emit,
};

describe('Integration test', () => {

	describe('static methods', () => {

		it('getEventsMixin', () => {

			expect(CesiumMouse.getEventsMixin()).toEqual(mixin);

		});

		it('mixinEventsMethods', () => {

			const result = CesiumMouse.mixinEventsMethods({});
			expect(result).toEqual(mixin);

		});

	});

	describe('constructor', () => {

		const createMouse = (pickedObjects = []) => new CesiumMouse({
			canvas: global.document.createElement('canvas'),
			drillPick: () => pickedObjects
		});
		let entity,
			spyMouseEmit,
			spyEntityEmit,
			pickedObjects;
		beforeEach(() => {

			entity = new Entity();
			CesiumMouse.mixinEventsMethods(entity);
			pickedObjects = [{ id: entity }];
			spyMouseEmit = jest.fn();
			spyEntityEmit = jest.fn();

		});

		afterEach(() => {

			spyMouseEmit.mockRestore();
			spyEntityEmit.mockRestore();

		});
		it('check leftclick. target.interactable = true', () => {

			const mouse = createMouse(pickedObjects);
			const eventName = 'leftclick';
			entity.interactable = true;
			entity.on(eventName, spyEntityEmit);
			mouse.on(eventName, spyMouseEmit);
			mouse._onEvent(eventName, { position: Cartesian2.ZERO });
			const event = {
				type: eventName,
				target: entity,
				pickedObjects,
				windowPosition: Cartesian2.ZERO
			};
			expect(spyMouseEmit).toHaveBeenCalledWith(event);
			expect(spyEntityEmit).toHaveBeenCalledWith(event);
			mouse.destroy();

		});

		it('check leftclick. target.interactable = false', () => {

			const mouse = createMouse(pickedObjects);
			const eventName = 'leftclick';
			entity.on(eventName, spyEntityEmit);
			mouse.on(eventName, spyMouseEmit);
			mouse._onEvent(eventName, { position: Cartesian2.ZERO });
			const event = {
				type: eventName,
				target: null,
				pickedObjects,
				windowPosition: Cartesian2.ZERO
			};
			expect(spyMouseEmit).toHaveBeenCalledWith(event);
			expect(spyEntityEmit).not.toHaveBeenCalled();
			mouse.destroy();

		});

		describe('check mousemove', () => {

			it('check mousemove. target.interactable = true. _over = null', () => {

				const mouse = createMouse(pickedObjects);
				const eventName = 'mousemove';
				const spyEntityMouseOverEmit = jest.fn();
				const spyEntityMouseOutEmit = jest.fn();
				entity.interactable = true;
				entity.on(eventName, spyEntityEmit);
				entity.on('mouseover', spyEntityMouseOverEmit);
				entity.on('mouseout', spyEntityMouseOutEmit);
				mouse.on(eventName, spyMouseEmit);
				mouse._onEvent(eventName, { position: Cartesian2.ZERO });
				const event = {
					type: eventName,
					target: entity,
					pickedObjects,
					windowPosition: Cartesian2.ZERO
				};
				expect(spyMouseEmit).toHaveBeenCalledWith(event);
				expect(spyEntityEmit).toHaveBeenCalledWith(event);
				expect(spyEntityMouseOverEmit).toHaveBeenCalledWith({
					...event,
					type: 'mouseover'
				});
				expect(spyEntityMouseOutEmit).not.toHaveBeenCalled();
				mouse.destroy();

			});

			it('check mouseout. target.interactable = true. _over = entity', () => {

				const mouse = createMouse([]);
				const eventName = 'mousemove';
				const spyEntityMouseOverEmit = jest.fn();
				const spyEntityMouseOutEmit = jest.fn();
				entity.interactable = true;
				entity.on(eventName, spyEntityEmit);
				entity.on('mouseover', spyEntityMouseOverEmit);
				entity.on('mouseout', spyEntityMouseOutEmit);
				mouse._over = entity;
				mouse.on(eventName, spyMouseEmit);
				mouse._onEvent(eventName, { position: Cartesian2.ZERO });
				const event = {
					type: eventName,
					target: null,
					pickedObjects: [],
					windowPosition: Cartesian2.ZERO
				};
				expect(spyMouseEmit).toHaveBeenCalledWith(event);
				expect(spyEntityEmit).not.toHaveBeenCalled();
				expect(spyEntityMouseOverEmit).not.toHaveBeenCalled();
				expect(spyEntityMouseOutEmit).toHaveBeenCalledWith({
					...event,
					target: entity,
					type: 'mouseout'
				});
				mouse.destroy();

			});

		});


	});

});
