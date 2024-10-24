const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");     // импорт плагина удаления файла сборки;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");    // плагин для работы с CSS;


module.exports = {
    devtool: "source-map",          // создавать source-map файл;
    target: ["web", "es5"],         // собирать в ES5 для более старых браузеров;
    // Путь к стартовому модулю.
    entry: path.resolve("./js/phonebookBootstrapVueExpress.js"),

    // Параметры для результата сборки.
    output: {
        filename: "webpackScript.js",
        path: path.resolve(__dirname, "../public"),
        assetModuleFilename: "[path][name][ext]?[contenthash]"
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader", options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, "css-loader", "sass-loader"
                ]
            },
            {
                test: /\.css$/, // к каким файлам применять Loader;
                // Применяем два Loader - поэтому массив.
                use: [
                    MiniCssExtractPlugin.loader, "css-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|ttf|eot|woff|woff2)$/, type: "asset/resource"
            }
        ]
    },

    // Секция для Плагинов.
    plugins: [
        // По-умолчанию очищается указанный путь результата.
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "styles.css" // имя файла с результатом;
        })
    ]
}