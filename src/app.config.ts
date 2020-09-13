// this can be in a folder with other configs
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// difficult to mantain
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => ({
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
