const express = require('express');
// passport = require('passport');

// Middleware to require login/auth
const jwt = require('./lib/jwtVerify'); //passport.authenticate('jwt', { session: false });
// const requireLogin = passport.authenticate('local', { session: false });

module.exports = (app) => {

  const api = express.Router();
  let n = '', 
    sg = [];

  const generate = (n, sg) => {
    for (let i = 0; i < sg.length; i++) {
      const router = express.Router(),
        uri = `${n}${sg[i].url}`;
      sg[i].controller(uri, api, router);
    }
  };

  // =================================
  // ad namespace routing
  // =================================

  n = '/ad';
  sg = [
    {
      url: '/auth',
      controller: (uri, api, router) => {

        // import controller functions
        const Controller = require(`./controllers/${uri}`);
    
        // set middleware
        api.use(uri, router);
        
        // declare subroutes 
        router.post('/login', Controller.login);
      }
    },
    {
      url: '/voices',
      controller: (uri, api, router) => {

        // import controller functions
        const Controller = require(`./controllers/${uri}`);
    
        // set middleware
        api.use(uri, router);
        
        // declare subroutes 
        router.get('/list', Controller.all);
      }
    }
  ];
  // subroutes
  generate(n, sg);

  // =================================
  // stt namespace routing
  // =================================

  n = '/stt';
  sg = [
    {
      url: '/auth',
      controller: (uri, api, router) => {

        // import controller functions
        const Controller = require(`./controllers/${uri}`);
    
        // set middleware
        api.use(uri, router);
        
        // declare subroutes 
        router.post('/login', Controller.login);
        router.post('/idle', Controller.idle);
        router.post('/googleauth', Controller.googleauth);
        router.post('/send', Controller.send);
        router.post('/verify', Controller.verify);
        router.post('/recover', Controller.recover);
        router.post('/reset', Controller.reset);
        router.post('/setpassword', Controller.setpassword);
      }
    },
    {
      url: '/users',
      controller: (uri, api, router) => {

        // import controller functions
        const Controller = require(`./controllers/${uri}`);
    
        // set middleware
        api.use(uri, router);
        
        router.param('id', Controller.validateId);
        // declare subroutes 
        router.post('/:id/authenticate', jwt.verifySttUser, Controller.authenticate);
        router.put('/:id/update', jwt.verifySttUser, Controller.update);
      }
    },
    {
      url: '/records',
      controller: (uri, api, router) => {
     
        const Controller = require(`./controllers/${uri}`);

        api.use(uri, router);

        router.param('rid', Controller.validateRid);
        router.get('/', jwt.verifySttUser, Controller.all);
        router.post('/', jwt.verifySttUser, Controller.create);
        router.post('/restore/:rid', jwt.verifySttUser, Controller.restore);
        router.put('/:rid', jwt.verifySttUser, Controller.update);
        router.delete('/:rid', jwt.verifySttUser, Controller.delete);
        router.delete('/permanent/:rid', jwt.verifySttUser, Controller.permanentDelete);
        router.get('/favorites', jwt.verifySttUser, Controller.favorites);
        router.get('/trash', jwt.verifySttUser, Controller.trash);
        router.get('/:rid/download', jwt.verifySttUser, Controller.download);
        router.post('/:rid/updatefavorite', jwt.verifySttUser, Controller.updatefavorite);
        //router.get('/list', jwt.verifySttUser, Controller.all);
        //router.post('/save', jwt.verifySttUser, Controller.save);
        //router.delete('/delete', jwt.verifySttUser, Controller.delete);
      }
    },
    {
      url: '/customizations',
      controller: (uri, api, router) => {
     
        const Controller = require(`./controllers/stt/customizations/index`);

        api.use(uri, router);

        api.param('CustomizationId', Controller.validateId);
        router.get('/customization', jwt.verifySttUser, Controller.getCustomizations);       
        router.get('/models', jwt.verifySttUser, Controller.all);
      }
    },
    {
      url: '/customizations/:CustomizationId',
      controller: (uri, api, router) => {
     
        const ParentController = require(`./controllers/stt/customizations/index`);
        const ChildController = require(`./controllers/stt/customizations/words`);

        api.use(uri, router);

        api.param('CustomizationId', ParentController.validateId);
        // set language table
        api.param('CustomizationId', ChildController.getLang);
        router.param('id', ChildController.getWord);
        
        router.get('/words', jwt.verifySttUser, ChildController.all);
        router.post('/words', jwt.verifySttUser, ChildController.create);
        router.get('/words/:id', jwt.verifySttUser, ChildController.show);
        router.delete('/words/:id', jwt.verifySttUser, ChildController.destroy);
        // router.update('/words/:id', jwt.verifyUser, ChildController.destroy);
      }
    },
    {
      url: '/customizations/:CustomizationId',
      controller: (uri, api, router) => {
     
        const ParentController = require(`./controllers/stt/customizations/index`);
        const ChildController = require(`./controllers/stt/customizations/corpora`);

        api.use(uri, router);

        api.param('CustomizationId', ParentController.validateId);
        // set language table
        // api.param('CustomizationId', ChildController.getLang);
        // router.param('id', ChildController.getWord);
        
        // router.get('/words', jwt.verifyUser, ChildController.all);
        router.post('/corpora', jwt.verifySttUser, ChildController.create);
        // router.get('/words/:id', jwt.verifyUser, ChildController.show);
        // router.delete('/words/:id', jwt.verifyUser, ChildController.destroy);
        // router.update('/words/:id', jwt.verifyUser, ChildController.destroy);
      }
      
    }
  ];
  // subroutes
  generate(n, sg);
 
  // base url
  app.use('/v1/api', api);

};