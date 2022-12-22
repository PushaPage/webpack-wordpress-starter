const { merge } = require('webpack-merge');
const webpackConfiguration = require('../webpack.config');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const environment = require('./environment');

module.exports = merge(webpackConfiguration, {
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
        new BrowserSyncPlugin(
            {
                open: 'external',
                ghostMode: false,
                notify: false,
                online: true,
                files: [
                    {
                        match: [environment.paths.source],
                        fn(event) {
                            if (event === 'change' || event === 'add' || event === 'unlink') {
                                const bs = require('browser-sync').get('bs-webpack-plugin');
                                bs.reload();
                            }
                        },
                    },
                ],
                ...environment.server,
            },
            {
                reload: false,
            }
        ),
    ],
});
