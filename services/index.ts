import PrismaQueryHelper from '@/helpers/prismaQuery';
import { db } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

class Service {
  public db: PrismaClient;
  public prismaQueryHelper: PrismaQueryHelper;
  constructor() {
    this.db = db;
    this.prismaQueryHelper = new PrismaQueryHelper();
  }
}

export default Service;
