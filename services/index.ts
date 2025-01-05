import PrismaQueryHelper from '@/helpers/prismaQuery';
import { db } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

/**
 * Default service class
 */
class Service {
  public db: PrismaClient;
  public prismaQueryHelper: PrismaQueryHelper;
  /**
   * Constructor for the Service class
   *
   * @remarks
   * The constructor sets the db and prismaQueryHelper properties of the class.
   * db is the Prisma client and prismaQueryHelper is an instance of the PrismaQueryHelper class.
   * The constructor does not take any arguments.
   */
  constructor() {
    this.db = db;
    this.prismaQueryHelper = new PrismaQueryHelper();
  }
}

export default Service;
