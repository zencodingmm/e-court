-- CreateTable
CREATE TABLE `tbl_e_doc` (
    `case_id` INTEGER NOT NULL AUTO_INCREMENT,
    `case_no` VARCHAR(191) NOT NULL,
    `date_of_submittion` DATE NOT NULL,
    `description_of_submittion` LONGTEXT NULL,
    `submitting_person` VARCHAR(191) NULL,
    `interpretation_of_tribunal` LONGTEXT NULL,
    `date_of_submission` DATE NULL,
    `date_of_decision` DATE NULL,
    `decided` LONGTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbl_e_doc_case_no_key`(`case_no`),
    PRIMARY KEY (`case_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_attachment_of_e_doc` (
    `attachment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `case_id` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `file_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`attachment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_user_type` (
    `user_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbl_user_type_user_type_id_type_description_key`(`user_type_id`, `type`, `description`),
    PRIMARY KEY (`user_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_code` VARCHAR(191) NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `user_rank` VARCHAR(191) NOT NULL,
    `locked` BOOLEAN NOT NULL DEFAULT false,
    `user_type_id` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbl_user_user_code_key`(`user_code`),
    UNIQUE INDEX `tbl_user_user_id_user_code_user_name_user_rank_key`(`user_id`, `user_code`, `user_name`, `user_rank`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_e_vote` (
    `e_vote_id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(512) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbl_e_vote_e_vote_id_description_key`(`e_vote_id`, `description`),
    PRIMARY KEY (`e_vote_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_e_voting_result` (
    `voting_result_id` INTEGER NOT NULL AUTO_INCREMENT,
    `e_vote_id` INTEGER NOT NULL,
    `description` VARCHAR(512) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `user_code` VARCHAR(191) NOT NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `user_rank` VARCHAR(191) NOT NULL,
    `result` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`voting_result_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_attachment_of_e_doc` ADD CONSTRAINT `tbl_attachment_of_e_doc_case_id_fkey` FOREIGN KEY (`case_id`) REFERENCES `tbl_e_doc`(`case_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_user` ADD CONSTRAINT `tbl_user_user_type_id_type_description_fkey` FOREIGN KEY (`user_type_id`, `type`, `description`) REFERENCES `tbl_user_type`(`user_type_id`, `type`, `description`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_e_voting_result` ADD CONSTRAINT `tbl_e_voting_result_e_vote_id_description_fkey` FOREIGN KEY (`e_vote_id`, `description`) REFERENCES `tbl_e_vote`(`e_vote_id`, `description`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_e_voting_result` ADD CONSTRAINT `tbl_e_voting_result_user_id_user_code_user_name_user_rank_fkey` FOREIGN KEY (`user_id`, `user_code`, `user_name`, `user_rank`) REFERENCES `tbl_user`(`user_id`, `user_code`, `user_name`, `user_rank`) ON DELETE CASCADE ON UPDATE CASCADE;
