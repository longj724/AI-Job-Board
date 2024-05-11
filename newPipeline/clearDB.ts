import { db } from './prismaClient';

const main = async () => {
  await db.posting.deleteMany({
    where: {},
  });
};

main();
