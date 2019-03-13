const path = require("path");
const autoprefixer = require("autoprefixer");
const ExtractCSS = require("extract-text-webpack-plugin");

const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
    entry: ["@babel/polyfill", ENTRY_FILE],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: [
                    {
                        loader: "babel-loader"
                    }
                ]
            },
            {
                test: /\.(scss)$/,
                use: ExtractCSS.extract([{
                    // 그 부분만 추출해줌
                    loader: "css-loader"
                    // css를 가져와줌
                }, {
                    loader: "postcss-loader",
                    options: {
                        plugins() {
                            return [autoprefixer({ browsers: "cover 99.5%" })]
                        }
                    }
                    // 특정 plugin들을 css에 실행시켜줌
                }, {
                    loader: "sass-loader"
                    // Sass(scss)를 CSS로 옮겨줌
                }])
            }
        ]
    },
    output: {
        path: OUTPUT_DIR,
        filename: "[name].js"
    },
    plugins: [new ExtractCSS("styles.css")]
}

module.exports = config;