-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'trainer', 'member');

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL DEFAULT 'Event Title',
    "images" TEXT NOT NULL DEFAULT '',
    "description" VARCHAR(200) DEFAULT 'Description here',
    "posted_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "joinform" TEXT DEFAULT 'https://example.com/join-form',

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liked_by" (
    "id" SERIAL NOT NULL,
    "u_id" INTEGER NOT NULL,
    "e_id" INTEGER NOT NULL,

    CONSTRAINT "liked_by_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trained_by" (
    "trainer_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "stat1" INTEGER,
    "stat2" INTEGER,
    "stat3" INTEGER,
    "stat4" INTEGER,
    "stat5" INTEGER,

    CONSTRAINT "trained_by_pkey" PRIMARY KEY ("trainer_id","member_id")
);

-- CreateTable
CREATE TABLE "training_assignments" (
    "id" SERIAL NOT NULL,
    "trainer_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "status" VARCHAR(20) DEFAULT 'active',
    "notes" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "role" "user_role" NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255),
    "email" VARCHAR(100) NOT NULL,
    "provider" VARCHAR(20),
    "provider_id" VARCHAR(100),
    "avatar" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(100) NOT NULL,
    "phone_no" VARCHAR(15),
    "last_activity" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_no_key" ON "users"("phone_no");

-- AddForeignKey
ALTER TABLE "liked_by" ADD CONSTRAINT "liked_by_e_id_fkey" FOREIGN KEY ("e_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "liked_by" ADD CONSTRAINT "liked_by_u_id_fkey" FOREIGN KEY ("u_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trained_by" ADD CONSTRAINT "trained_by_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trained_by" ADD CONSTRAINT "trained_by_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_assignments" ADD CONSTRAINT "training_assignments_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "training_assignments" ADD CONSTRAINT "training_assignments_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
