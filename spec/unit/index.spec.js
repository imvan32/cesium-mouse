import {
	Cartesian2,
	Entity,
	ScreenSpaceEventType,
	ScreenSpaceEventHandler
} from 'cesium';

const mixin = {
	on() {},
	off() {},
	emit() {},
};
jest.setMock('eventemitter3', mixin);
// eslint-disable-next-line import/first
import CesiumMouse, { formatEventType } from '../../src';

const createMouse = () => new CesiumMouse({
	canvas: global.document.createElement('canvas'),
	drillPick: () => ([])
});

describe('Unit test', () => {

	// describe('formatEventType', () => {

	// 	it('check LEFT_DOWN', () => {

	// 		expect(formatEventType('LEFT_DOWN')).toBe('leftdown');

	// 	});

	// });
	describe('static methods', () => {

		it('mixinEventsMethods', () => {


			const spyGetMixin = jest.spyOn(CesiumMouse, 'getEventsMixin').mockImplementation(() => mixin);
			const result = CesiumMouse.mixinEventsMethods({});
			expect(result).toHaveProperty('on');
			expect(result).toHaveProperty('off');
			expect(result).toHaveProperty('emit');
			spyGetMixin.mockRestore();

		});

	});
	describe('constructor', () => {

		const ignoreEventTypes = ['PINCH_START', 'PINCH_MOVE', 'PINCH_END'];

		const eventTypes = Object.keys(ScreenSpaceEventType).filter(eventType =>
			!ignoreEventTypes.some(ignoreEventType => ignoreEventType === eventType));

		it('check call _addEvent', () => {

			const spy = jest.spyOn(CesiumMouse.prototype, '_addEvent');

			const mouse = createMouse();
			eventTypes.forEach((eventType, index) => {

				expect(spy.mock.calls[index][0]).toBe(eventType);

			});


			mouse.destroy();

		});

		it('check _addEvent', () => {

			const spy = jest.spyOn(ScreenSpaceEventHandler.prototype, 'setInputAction');
			const mouse = createMouse();

			eventTypes.forEach((eventType, index) => {

				expect(spy.mock.calls[index][1]).toBe(ScreenSpaceEventType[eventType]);
				expect(mouse.handler._inputEvents[ScreenSpaceEventType[eventType]]).toBeDefined();

			});


			mouse.destroy();

		});

	});

	describe('methods', () => {

		let mouse;
		beforeEach(() => {

			mouse = createMouse();

		});

		afterEach(() => {

			mouse.destroy();

		});

		describe('destroy', () => {

			it('check clear variable and destroy handler', () => {

				const spyHandlerDestroy = jest.spyOn(ScreenSpaceEventHandler.prototype, 'destroy').mockImplementation(() => {});
				mouse._over = 'notNull';
				mouse.destroy();
				expect(spyHandlerDestroy).toHaveBeenCalled();
				expect(mouse._scene).toBeNull();
				expect(mouse._over).toBeNull();

			});

		});

		describe('_onEvent', () => {

			let spyEmit,
				spyGetPrimitive,
				spyNotify,
				spyOverOut;

			beforeEach(() => {

				spyEmit = jest.spyOn(CesiumMouse.prototype, 'emit');
				spyGetPrimitive = jest.spyOn(CesiumMouse.prototype, '_getInteractablePrimitive');
				spyNotify = jest.spyOn(CesiumMouse.prototype, '_notify').mockImplementation(() => {});
				spyOverOut = jest.spyOn(CesiumMouse.prototype, '_mouseOverOut').mockImplementation(() => {});

			});

			afterEach(() => {

				spyGetPrimitive.mockRestore();
				spyNotify.mockRestore();
				spyOverOut.mockRestore();
				spyEmit.mockRestore();

			});

			it('eventName = leftclick. event = undefined. target = null', () => {

				mouse._onEvent('leftclick');
				expect(spyGetPrimitive).not.toHaveBeenCalled();
				expect(spyNotify).not.toHaveBeenCalled();
				expect(spyOverOut).not.toHaveBeenCalled();
				expect(spyEmit).toHaveBeenCalledWith('leftclick', {
					windowPosition: null,
					pickedObjects: [],
					target: null,
					type: 'leftclick'
				});

			});

			it('eventName = leftclick. event = { position: Cartesian2.ZERO }. target = null', () => {

				spyGetPrimitive.mockReturnValue(null);
				mouse._onEvent('leftclick', { position: Cartesian2.ZERO });
				expect(spyGetPrimitive).toHaveBeenCalled();
				expect(spyNotify).not.toHaveBeenCalled();
				expect(spyOverOut).not.toHaveBeenCalled();
				expect(spyEmit).toHaveBeenCalledWith('leftclick', {
					windowPosition: Cartesian2.ZERO,
					pickedObjects: [],
					target: null,
					type: 'leftclick'
				});

			});

			it('eventName = leftclick. event = { position: Cartesian2.ZERO }. target = entity', () => {

				const entity = new Entity();
				spyGetPrimitive.mockReturnValue(entity);
				mouse._onEvent('leftclick', { position: Cartesian2.ZERO });
				expect(spyGetPrimitive).toHaveBeenCalled();
				expect(spyNotify).toHaveBeenCalled();
				expect(spyOverOut).not.toHaveBeenCalled();
				expect(spyEmit).toHaveBeenCalledWith('leftclick', {
					windowPosition: Cartesian2.ZERO,
					pickedObjects: [],
					target: entity,
					type: 'leftclick'
				});

			});

			it('eventName = mousemove. event = { position: Cartesian2.ZERO }. target = entity', () => {

				const entity = new Entity();
				spyGetPrimitive.mockReturnValue(entity);
				mouse._onEvent('mousemove', { position: Cartesian2.ZERO });
				expect(spyGetPrimitive).toHaveBeenCalled();
				expect(spyNotify).toHaveBeenCalled();
				expect(spyOverOut).toHaveBeenCalled();
				expect(spyEmit).toHaveBeenCalledWith('mousemove', {
					windowPosition: Cartesian2.ZERO,
					pickedObjects: [],
					target: entity,
					type: 'mousemove'
				});

			});

		});

		describe('_getInteractablePrimitive', () => {

			const createEntities = (opt = {}) => ([
				{ id: new Entity(opt) },
				{ id: new Entity(opt) },
				{ id: new Entity(opt) }
			]);

			it('everyone have interactable = undefined and show = true', () => {

				expect(mouse._getInteractablePrimitive(createEntities())).toBeNull();

			});

			it('the second have interactable = true and show = true', () => {

				const picked = createEntities();
				picked[1].id.interactable = true;
				expect(mouse._getInteractablePrimitive(picked).id).toBe(picked[1].id.id);

			});

			it('the second have interactable = true and show = false', () => {

				const picked = createEntities({ show: false });
				picked[1].id.interactable = true;
				expect(mouse._getInteractablePrimitive(picked)).toBeNull();

			});

			it('the first and the second have interactable = true and show = true', () => {

				const picked = createEntities();
				picked[0].id.interactable = true;
				picked[1].id.interactable = true;
				expect(mouse._getInteractablePrimitive(picked).id).toBe(picked[0].id.id);

			});

		});

		describe('_notify', () => {

			it('check call emit', () => {

				Entity.prototype.emit = function () {};
				const spyEmit = jest.spyOn(Entity.prototype, 'emit');
				const target = new Entity();
				const pickedObjects = [target];
				const type = 'leftclick';
				mouse._notify(type, target, Cartesian2.ZERO, pickedObjects);
				expect(spyEmit).toBeCalledWith(type, {
					windowPosition: Cartesian2.ZERO,
					pickedObjects,
					target,
					type
				});
				spyEmit.mockRestore();
				delete Entity.prototype.emit;

			});

		});

		describe('_mouseOverOut', () => {

			let spyNotify;
			beforeEach(() => {

				spyNotify = jest.spyOn(CesiumMouse.prototype, '_notify').mockImplementation(() => {});

			});
			afterEach(() => {

				spyNotify.mockRestore();

			});
			it('picked = null. _over = null', () => {

				mouse._mouseOverOut(Cartesian2.ZERO, null, []);
				expect(mouse._over).toBeNull();
				expect(spyNotify).not.toHaveBeenCalled();

			});
			it('picked = Entity. _over = null', () => {

				const picked = new Entity();
				const pickedObjects = [{ id: picked }];
				mouse._mouseOverOut(Cartesian2.ZERO, picked, pickedObjects);
				expect(spyNotify).toHaveBeenCalledWith('mouseover', picked, Cartesian2.ZERO, pickedObjects);
				expect(mouse._over).toBe(picked);

			});
			it('picked = null. _over = Entity', () => {

				const picked = null;
				const pickedObjects = [];
				const entity = new Entity();
				mouse._over = entity;
				mouse._mouseOverOut(Cartesian2.ZERO, picked, pickedObjects);
				expect(spyNotify).toHaveBeenCalledWith('mouseout', entity, Cartesian2.ZERO, pickedObjects);
				expect(mouse._over).toBe(null);

			});
			it('picked = Entity. _over = Entity', () => {

				const picked = new Entity();
				const pickedObjects = [picked];
				mouse._over = picked;
				mouse._mouseOverOut(Cartesian2.ZERO, picked, pickedObjects);
				expect(spyNotify).not.toHaveBeenCalled();
				expect(mouse._over).toBe(picked);

			});
			it('picked = Entity1. _over = Entity2', () => {

				const picked = new Entity();
				const pickedObjects = [picked];
				const overEntity = new Entity();
				mouse._over = overEntity;
				mouse._mouseOverOut(Cartesian2.ZERO, picked, pickedObjects);
				expect(spyNotify.mock.calls[0]).toEqual(['mouseover', picked, Cartesian2.ZERO, pickedObjects]);
				expect(spyNotify.mock.calls[1]).toEqual(['mouseout', overEntity, Cartesian2.ZERO, pickedObjects]);
				expect(mouse._over).toBe(picked);

			});

		});

	});


});
