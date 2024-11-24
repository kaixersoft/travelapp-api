import { MigrationInterface, QueryRunner } from "typeorm";

export class AHPtables1732457377072 implements MigrationInterface {
    name = 'AHPtables1732457377072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "item" ("id" SERIAL NOT NULL, "name" text NOT NULL, "criteriaId" integer, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "criteria" ("id" SERIAL NOT NULL, "name" text NOT NULL, CONSTRAINT "PK_91cd5f7ff7be5ade9bca5b98cfb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "query" ("id" SERIAL NOT NULL, "userQuery" text NOT NULL, "data" json NOT NULL, "criteriaId" integer, CONSTRAINT "PK_be23114e9d505264e2fdd227537" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "result" ("id" SERIAL NOT NULL, "results" json NOT NULL, "queryId" integer, CONSTRAINT "PK_c93b145f3c2e95f6d9e21d188e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_f127b0efef28eede95ea58b9f12" FOREIGN KEY ("criteriaId") REFERENCES "criteria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "query" ADD CONSTRAINT "FK_05952a1a613f9a3deef0c4c30db" FOREIGN KEY ("criteriaId") REFERENCES "criteria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "result" ADD CONSTRAINT "FK_66e40b404d74f785af176af1e7c" FOREIGN KEY ("queryId") REFERENCES "query"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_66e40b404d74f785af176af1e7c"`);
        await queryRunner.query(`ALTER TABLE "query" DROP CONSTRAINT "FK_05952a1a613f9a3deef0c4c30db"`);
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_f127b0efef28eede95ea58b9f12"`);
        await queryRunner.query(`DROP TABLE "result"`);
        await queryRunner.query(`DROP TABLE "query"`);
        await queryRunner.query(`DROP TABLE "criteria"`);
        await queryRunner.query(`DROP TABLE "item"`);
    }

}
