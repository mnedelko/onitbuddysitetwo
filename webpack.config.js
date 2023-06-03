module.exports = {
    resolve: {
        fallback: { 
            "https": require.resolve("https-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "http": require.resolve("stream-http"),
            "stream": false 
             },
    }
}