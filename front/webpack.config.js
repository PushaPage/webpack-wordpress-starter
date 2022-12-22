const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const environment = require('./config/environment');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const copySymbolSprite = () => {
    return new HTMLWebpackPlugin({
        filename: 'images/symbol-sprite.html',
        template: './src/images/symbol-sprite.html',
        inject: false,
        minify: {
            collapseWhitespace: isProd,
        },
    });
};

const useStyleLoaders = () => {
    return [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: {
                importLoaders: 1,
                sourceMap: isDev,
            },
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: isDev,
            },
        },
        {
            loader: 'sass-loader',
            options: {
                sourceMap: isDev,
            },
        },
    ];
};

module.exports = {
    entry: {
        app: path.resolve(environment.paths.source, 'js', 'index.js'),
    },
    output: {
        filename: 'js/[name].js',
        path: environment.paths.output,
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                include: /styles/,
                use: useStyleLoaders(),
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(png|webp|jpe?g|svg)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: environment.limits.images,
                    },
                },
                generator: {
                    filename: 'images/static/[name].[hash:6][ext]',
                },
            },
            {
                test: /\.(woff|woff2)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: environment.limits.fonts,
                    },
                },
                generator: {
                    filename: 'fonts/[name].[hash:6][ext]',
                },
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: ['**/*'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(environment.paths.source, 'images', 'favicon'),
                    to: path.resolve(environment.paths.output, '[name][ext]'),
                    toType: 'template',
                    globOptions: {
                        ignore: ['*.DS_Store', 'Thumbs.db'],
                    },
                },
                {
                    from: path.resolve(environment.paths.source, 'images', 'content'),
                    to: path.resolve(environment.paths.output, 'images', 'content'),
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', 'Thumbs.db'],
                    },
                },
                {
                    from: path.resolve(environment.paths.source, 'videos'),
                    to: path.resolve(environment.paths.output, 'videos'),
                    toType: 'dir',
                    globOptions: {
                        ignore: ['*.DS_Store', 'Thumbs.db'],
                    },
                },
            ],
        }),
        new WebpackManifestPlugin({
            publicPath: 'assets',
            filter: file => {
                return /^(app|vendors)\.(js|css)$/.test(file.name);
            },
        }),
    ].concat(copySymbolSprite()),
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    target: isProd ? 'browserslist' : 'web',
};
