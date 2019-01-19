module.exports = {
  apps: [{
    name: 'server-code',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-52-59-230-250.eu-central-1.compute.amazonaws.com',
      key: '../dandelion.pem',
      ref: 'origin/develop',
      repo: 'git@github.com:dandelionn/server-code.git',
      path: '/home/ubuntu/server-code',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}