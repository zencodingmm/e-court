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
    `current` BOOLEAN NOT NULL DEFAULT false,

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
    `file_type` VARCHAR(191) NOT NULL,

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
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `user_rank` VARCHAR(191) NOT NULL,
    `user_image` VARCHAR(191) NULL,
    `locked` BOOLEAN NOT NULL DEFAULT false,
    `user_type_id` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbl_user_user_code_key`(`user_code`),
    UNIQUE INDEX `tbl_user_username_key`(`username`),
    UNIQUE INDEX `tbl_user_user_id_user_code_username_user_rank_key`(`user_id`, `user_code`, `username`, `user_rank`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_e_vote` (
    `e_vote_id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` LONGTEXT NOT NULL,
    `current` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbl_e_vote_e_vote_id_key`(`e_vote_id`),
    PRIMARY KEY (`e_vote_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_e_vote_attachment` (
    `attachment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `e_vote_id` INTEGER NOT NULL,
    `file_name` VARCHAR(191) NOT NULL,
    `file_type` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`attachment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_e_voting_result` (
    `voting_result_id` INTEGER NOT NULL AUTO_INCREMENT,
    `e_vote_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `user_code` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `user_rank` VARCHAR(191) NOT NULL,
    `result` ENUM('support', 'neutral', 'not_support') NOT NULL DEFAULT 'not_support',
    `comment` LONGTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`voting_result_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_setting` (
    `setting_id` INTEGER NOT NULL AUTO_INCREMENT,
    `live_streaming_link` VARCHAR(191) NULL,
    `e_lib_link` VARCHAR(191) NULL,
    `case_flow_link` VARCHAR(191) NULL,
    `other_1` VARCHAR(191) NULL,
    `other_2` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `current` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`setting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_attachment_of_e_doc` ADD CONSTRAINT `tbl_attachment_of_e_doc_case_id_fkey` FOREIGN KEY (`case_id`) REFERENCES `tbl_e_doc`(`case_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_user` ADD CONSTRAINT `tbl_user_user_type_id_type_description_fkey` FOREIGN KEY (`user_type_id`, `type`, `description`) REFERENCES `tbl_user_type`(`user_type_id`, `type`, `description`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_e_vote_attachment` ADD CONSTRAINT `tbl_e_vote_attachment_e_vote_id_fkey` FOREIGN KEY (`e_vote_id`) REFERENCES `tbl_e_vote`(`e_vote_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_e_voting_result` ADD CONSTRAINT `tbl_e_voting_result_e_vote_id_fkey` FOREIGN KEY (`e_vote_id`) REFERENCES `tbl_e_vote`(`e_vote_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_e_voting_result` ADD CONSTRAINT `tbl_e_voting_result_user_id_user_code_username_user_rank_fkey` FOREIGN KEY (`user_id`, `user_code`, `username`, `user_rank`) REFERENCES `tbl_user`(`user_id`, `user_code`, `username`, `user_rank`) ON DELETE CASCADE ON UPDATE CASCADE;
