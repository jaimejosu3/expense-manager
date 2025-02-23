import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1708745600000 implements MigrationInterface {
    name = 'InitialSchema1708745600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users (
                id VARCHAR(36) NOT NULL PRIMARY KEY,
                firstName VARCHAR(255) NOT NULL,
                lastName VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                isActive BOOLEAN DEFAULT true,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await queryRunner.query(`
            CREATE TABLE categories (
                id VARCHAR(36) NOT NULL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                color VARCHAR(7) NOT NULL,
                isActive BOOLEAN DEFAULT true,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        await queryRunner.query(`
            CREATE TABLE expenses (
                id VARCHAR(36) NOT NULL PRIMARY KEY,
                amount DECIMAL(10,2) NOT NULL,
                description TEXT NOT NULL,
                date TIMESTAMP NOT NULL,
                categoryId VARCHAR(36),
                userId VARCHAR(36),
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (categoryId) REFERENCES categories(id),
                FOREIGN KEY (userId) REFERENCES users(id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE expenses`);
        await queryRunner.query(`DROP TABLE categories`);
        await queryRunner.query(`DROP TABLE users`);
    }
}