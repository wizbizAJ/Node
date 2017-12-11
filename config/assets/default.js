'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        // 'public/lib/bootstrap/dist/css/bootstrap.css',
        // 'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
        'public/lib/sweetalert/dist/sweetalert.css',
        'public/lib/angular-bootstrap-colorpicker/css/colorpicker.css',
        'public/lib/angular-ui-select/dist/select.css',
        'public/lib/angular-auto-complete/angular-auto-complete.css',
        'public/lib/angular-datepicker-light/stylesheets/angular-datepicker-light.css'
        // 'public/lib/angular-filemanager/dist/angular-filemanager.min.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/tinymce/tinymce.js',
        'public/lib/angular-ui-tinymce/src/tinymce.js',
        'public/lib/sweetalert/dist/sweetalert.min.js',
        'public/lib/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
        'public/lib/angular-ui-select/dist/select.js',
        'public/lib/angular-auto-complete/angular-auto-complete.js',
        'public/lib/underscore/underscore.js',
        'public/lib/moment/moment.js',
        'public/lib/angular-datepicker-light/angular-datepicker-light.js',
        'public/lib/angular-translate/angular-translate.js',
        'public/lib/angular-filemanager/dist/angular-filemanager.min.js',
        'public/assets/bower_components/jQuery-Smart-Wizard/js/jquery.smartWizard.js',
        'public/assets/bower_components/bb-jquery-validation/dist/jquery.validate.js',
        'public/assets/js/form-wizard.js'
        // 'public/lib/bootstrap/dist/js/bootstrap.js',
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/{css,less,scss}/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
