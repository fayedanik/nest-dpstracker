import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  //   const user = process.env.MONGO_USER;
  //   const password = process.env.MONGO_PASSWORD;
  const host = process.env.MONGO_HOST;
  const port = process.env.MONGO_PORT;
  const db = process.env.TENANT_ID;
  console.log(
    `Connecting to MongoDB at ${process.env.MONGO_CONNECTION_STRING}/${db}`,
  );
  return {
    uri: `${process.env.MONGO_CONNECTION_STRING}/${db}`,
  };
});
