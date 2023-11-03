/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	webpack: (config, { isServer }) => {
		if (isServer)
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			config.resolve.fallback = {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				...config.resolve.fallback,
				crypto: require.resolve("crypto-browserify"),
				stream: require.resolve("stream-browserify"),
				buffer: require.resolve("buffer-browserify"),
			}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config
	},
	experimental: {
		optimizeServerReact: true,
	},
}

module.exports = config
