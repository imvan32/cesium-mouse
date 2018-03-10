

const registerLink = require('jsdoc/util/templateHelper').registerLink;

const names = [
	'Cartesian2',
	'Entity',
	'Scene',
	'Primitive'
];

const rootCesiumLink = 'https://cesiumjs.org/Cesium/Build/Documentation/';

exports.handlers = {
	parseBegin() {

		names.forEach((name) => {

			registerLink(name, `${rootCesiumLink}${name}.html`);

		});

	}
};
