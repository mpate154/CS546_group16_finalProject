import mainRoutes from './main.js';
import {static as staticDir} from 'express';

const constructorMethod = (app) => {
  
  app.use('/', mainRoutes);
  app.use('/public', staticDir('public'));

  app.use('*', (req, res) => {
    res.redirect('/posts');
  });
};

export default constructorMethod;
