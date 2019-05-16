let path = require('path');

let config = {
  debug: true,

  host: 'localhost',

  google_tracker_id: '',

  cnzz_tracker_id: '',

  db: 'mongodb://127.0.0.1/travels-data',

  session_secret: 'node_club_secret',
  auth_cookie_name: 'node_club',

  port: 3000,

  list_topic_count: 20,

  log_dir: path.join(__dirname, 'logs'),

  mail_opts: {
    host: 'smtp.126.com',
    port: 25,
    auth: {
      user: 'club@126.com',
      pass: 'club'
    },
    ignoreTLS: true,
  },

  oneapm_key: '',

  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },

  file_limit: '1MB',

  create_post_per_day: 1000,
  create_reply_per_day: 1000,
  create_user_per_ip: 1000,
  visit_per_day: 1000,

  secrets: {
    session: 'onetouncountable'
  }
};

module.exports = config;
