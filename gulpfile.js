var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');
var args = require('yargs').argv;

var locationConfig = require('./tools/config/location.config');
var webpackDevServerConfig = require('./tools/webpack/dev-server.config.js');

gulp.task('clean', clean);

gulp.task('build', build());

gulp.task('demo', gulp.series(
    enableDemo,
    build(),
    startServer,
    openBrowser
));

gulp.task('dev', gulp.series(
    enableDev,
    gulp.parallel(
        watchServer,
        inspect,
        test(),
        gulp.series(
            build(),
            startServerDebug,
            openBrowser

        )
    )
));

gulp.task('test', test());
gulp.task('test:server', testServer)

function clean() {
    var del = require('del');

    return del(locationConfig.dist);
}

function build() {
    return gulp.series(
        clean,
        gulp.parallel(
            buildClient(),
            buildServer
        )
    );
}

function buildClient() {
    return gulp.series(
        buildClientConfig,
        gulp.parallel(
            buildClientIndex,
            buildClientCssVendors,
            buildClientJsVendors,
            buildClientWebpack
        )
    );
}

var buildClientConfigHasRun = false;
function buildClientConfig(done) {
    if(buildClientConfigHasRun) {
        done();

        return;
    }

    buildClientConfigHasRun = true;

    var stream;

    if(args.dev || args.demo) {
        stream = gulp.src(locationConfig.client.config.local);
    } else if(process.env.BUILD_ENV === 'dev') {
        stream = gulp.src(locationConfig.client.config.dev);
    } else {
        stream = gulp.src(locationConfig.client.config.prod);
    }

    return stream
        .pipe($.rename(locationConfig.client.config.name))
        .pipe(gulp.dest(locationConfig.client.config.dest));
}

function buildClientIndex() {
    return gulp.src(locationConfig.client.index)
        .pipe(gulp.dest(locationConfig.client.dist.location));
}

function buildClientCssVendors() {
    return gulp.src([
        require.resolve('bootstrap/dist/css/bootstrap.min.css')
    ])
        .pipe(removeSourceMappingURLs())
        .pipe($.concat('vendors.css'))
        .pipe(gulp.dest(locationConfig.client.dist.css));
}

function buildClientJsVendors() {
    return gulp.src([
        require.resolve('jquery/dist/jquery.min.js'),
        require.resolve('bootstrap/dist/js/bootstrap.min.js'),
        require.resolve('underscore/underscore-min.js'),
        require.resolve('socket.io-client/dist/socket.io.min.js'),
        require.resolve('cloak/cloak-client.min.js')
    ])
        .pipe(removeSourceMappingURLs())
        .pipe($.concat('vendors.js'))
        .pipe(gulp.dest(locationConfig.client.dist.js));
}

function removeSourceMappingURLs() {
    return $.replace(/sourceMappingURL=/g, '');
}

function buildClientWebpack(done) {
    var webpack = require('webpack');
    var webpackConfig;

    if(!args.dev) {
        webpackConfig = require('./tools/webpack/config.prod.js');

        webpack(webpackConfig, function(error) {
            exitOnError(error);

            done();
        });

        return;
    }

    webpackConfig = require('./tools/webpack/config.dev.js');

    var compiler = webpack(webpackConfig);
    completeOnSuccessfulCompile(compiler, done);

    var WebpackDevServer = require('webpack-dev-server');
    var webpackDevServer = new WebpackDevServer(compiler, webpackDevServerConfig.options);
    webpackDevServer.listen(webpackDevServerConfig.port, webpackDevServerConfig.host, function(error) {
        exitOnError(error);

        console.info('Webpack dev server listening on port ' + webpackDevServerConfig.port);
    });

    function exitOnError(error) {
        if(!error) {
            return;
        }

        console.error('ERROR: Webpack Build Failed');
        console.error('- ' + error.name);
        console.error('- ' + error.message);

        process.exit(1);
    }

    function completeOnSuccessfulCompile(compiler, done) {
        compiler.plugin('done', function() {
            done();
        });
    }
}

function buildServer() {
    return gulp.src(locationConfig.server.filesForBuild)
        .pipe(gulp.dest(locationConfig.server.dist.location));
}

function watchServer() {
    gulp.watch(locationConfig.server.filesForBuild, buildServer);
}

function enableDev(done) {
    args.dev = true;
    done();
}

function enableDemo(done) {
    args.demo = true;
    done();
}

function inspect() {
    var nodeInspector = require('gulp-node-inspector');
    return gulp.src(locationConfig.server.filesForBuild)
    .pipe(nodeInspector({
          webPort: 8081
        }));

}
function startServer(done) {
    getServer(false, done)
}

function startServerDebug(done) {
    getServer(true, done)
}

function  getServer(debug, done) {
    var nodemon = require('nodemon');
    var exec = debug? 'node --debug': 'node'
    nodemon({
            script: locationConfig.server.dist.location,
             exec: exec,
            watch: locationConfig.server.dist.watch
        })
        .once('start', done);
}


function openBrowser(done) {
    var opn = require('opn');
    var serverAddress = args.dev ? webpackDevServerConfig.address : locationConfig.server.address;

    opn(serverAddress);
    done();
}

function test() {
    return gulp.series(
        buildClientConfig,
        gulp.parallel(
            testClient,
            testServer
        )
    )
}

function testClient(done) {
    var KarmaServer = require('karma').Server;

    new KarmaServer({
        configFile: locationConfig.karmaConfig,
        singleRun: !args.dev
    }, done).start();
}

function testServer(done) {
    var jasmineNode = require('jasmine-node');
    jasmineNode.run({
        specFolders: [locationConfig.server.src],
        captureExceptions: true,
        onComplete: function() {
            done();
        }
    });

    if(args.dev) {
        gulp.watch(locationConfig.server.srcGlob, testServer);
    }
}
