module.exports = {
    mode: "production",
    entry: ['@babel/polyfill', './src/main.js'],
    // ファイルの出力設定
    output: {
        //  出力ファイルのディレクトリ名
        path: `${__dirname}/dist/js`,
        // 出力ファイル名
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                // 拡張子 .js の場合
                test: /\.js$/,
                use: [
                    {
                        // Babel を利用する
                        loader: 'babel-loader',
                        // Babel のオプションを指定する
                        options: {
                            presets: [
                                // プリセットを指定することで、ES2020 を ES5 に変換
                                '@babel/preset-env',
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                // exclude: /node_modules/,
                use: [
                    'raw-loader',
                    'glslify-loader'
                ]
            }
        ]
    },
    devtool: 'inline-source-map'
};
