module.exports = {
  apps: [{
    name: 'theusefulweb.tk',
    script: './backend/index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-18-195-241-53.eu-central-1.compute.amazonaws.com',
      key: '../ssh/dandelion.pem',
      ref: 'origin/develop',
      repo: 'git@github.com:dandelionn/theusefulweb.tk.git',
      path: '/home/ubuntu/theusefulweb.tk',
      'post-deploy': 'npm run prepare && pm2 startOrRestart ecosystem.config.js'
    }
  }
}