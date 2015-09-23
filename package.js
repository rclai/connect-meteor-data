Package.describe({
  name: 'lai:connect-meteor-data',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Connect your React components with Meteor reactive data.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/rclai/meteorize-react-component.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use([
    'react',
    'react-meteor-data'
  ]);
  api.addFiles('connect-meteor-data.jsx');
  api.export('connectMeteorData');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('reactive-var');
  api.use('lai:connect-meteor-data');
  api.use('jsx');
  api.use('tracker');
  api.use('test-helpers');
  api.addFiles('connect-meteor-data-tests.jsx', 'client');
});
