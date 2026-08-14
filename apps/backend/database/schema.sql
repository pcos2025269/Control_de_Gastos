create table if not exists users (
    id serial primary key,
    username varchar(50) not null unique,
    password varchar(255) not null,
    role varchar(20) not null check (role in ('admin', 'user')),
    created_at timestamp default current_timestamp
);

created index if not exists idx_users_username on users(username);