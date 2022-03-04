const router = require('express').Router();
const { User } = require('../models');
const Project = require('../models/Project');
const Profile = require('../models/Profile');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    res.render('login');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/projectRender', async (req, res) => {
  try {
    res.render('projectForm');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/activitiesRender', async (req, res) => { 
  try {
    // Get all projects and JOIN with user data
    const projectData = await Project.findAll();
    res.json(projectData);
    //console.log('projectData',projectData);

    //res.render('activitiesForm');
  } catch (err) {
    res.status(500).json(err);
  }
  
});

router.get('/profileActivitiesRender/:profileId', async (req, res) => { 
  try {
    // Get all projects and JOIN with profile data
    const projectData = await Project.findAll({      
      where: {
        userId: req.params.profileId,
      }    
    });
    //res.json(projectData);
    //console.log('projectData',projectData);

    const projects = projectData.map((project) => project.get({ plain: true }));   

    res.render('activitiesForm',{
      projects
    });
  } catch (err) {
    res.status(500).json(err);
  }
  
});


router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const project = projectData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // // If the user is already logged in, redirect the request to another route
  // if (req.session.logged_in) {
  //   res.redirect("/profile");
  //   return;
  // }
  console.log('login');
  res.render('login');
});

router.get('/calendar', (req, res) => {
  // // If the user is already logged in, redirect the request to another route
  // if (req.session.logged_in) {
  //   res.redirect("/profile");
  //   return;
  // }
  console.log('calendar');
  res.render('calendar');
});
module.exports = router;
