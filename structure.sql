create database if not exists `general`;
use `general`;
drop table if exists `itcomputers`;
create table `itcomputers`
(
    `id`               int primary key auto_increment,
    `asset_number`     varchar(30) not null,
    `make`             varchar(128) default null,
    `model`            varchar(128) default null,
    `condition`        tinyint      default 0,
    `location`         varchar(255) default null,
    `primary_user`     varchar(255) default null,
    `operating_system` varchar(255) default null,
    `type`             tinyint      default 0,
    `available`        tinyint      default 0,
    `specs`            text         default null,
    `notes`            text         default null,
    `creation_date`    datetime     default current_timestamp,
    `last_update`      datetime     default current_timestamp on update current_timestamp
);
