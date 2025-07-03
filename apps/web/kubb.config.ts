import 'dotenv/config'
import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'

export default defineConfig(() => {
  return {
    root: '.',
    input: {
      path: './api.yaml',
    },
    output: {
      path: './src/gen',
    },
    plugins: [
      pluginOas({
        serverIndex: 0
      }),
      pluginTs({
        unknownType: "void"
      }),
      pluginReactQuery({
        output: {
          path: './hooks',
        },
        group: {
          type: 'tag',
          name: ({ group }) => `${group}Hooks`,
        },
        client: {
          dataReturnType: 'full',
          baseURL: process.env.VITE_API_URL,
        },
        mutation: {
          methods: ['post', 'put', 'patch', 'delete'],
        },
        query: {
          methods: ['get'],
          importPath: "@tanstack/react-query"
        },
        suspense: {},
      }),
    ],
  }
})