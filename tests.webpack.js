require.context('./src', true, /.js$/);

const testsContext = require.context('./spec/e2e', true, /\.js$/);
testsContext.keys().forEach(testsContext);

