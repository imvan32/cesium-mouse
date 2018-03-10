const { JSDOM } = require('jsdom');
const fs = require('fs');

const { window } = new JSDOM('', { runScripts: 'dangerously' });
const myLibrary = fs.readFileSync('./node_modules/cesium/Build/CesiumUnminified/Cesium.js', { encoding: 'utf-8' });

const scriptEl = window.document.createElement('script');
scriptEl.textContent = myLibrary;
window.document.body.appendChild(scriptEl);
global.document = window.document;
jest.setMock('cesium', window.Cesium);
