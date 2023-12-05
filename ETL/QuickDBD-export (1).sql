-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "suicide_data" (
    "data_id" INT   NOT NULL,
    "country" VARCHAR   NOT NULL,
    "year" FLOAT   NOT NULL,
    "sex" VARCHAR   NOT NULL,
    "age" VARCHAR   NOT NULL,
    "suicides_no" FLOAT   NOT NULL,
    "population" FLOAT   NOT NULL,
    "suicides_per_100k_pop" FLOAT   NOT NULL,
    "generation" VARCHAR   NOT NULL,
    CONSTRAINT "pk_suicide_data" PRIMARY KEY (
        "data_id"
     )
);

CREATE TABLE "gdp_data" (
    "data_id" INT   NOT NULL,
    "country" VARCHAR   NOT NULL,
    "gdp_for_year" VARCHAR   NOT NULL,
    "gdp_per_capita" FLOAT   NOT NULL,
    CONSTRAINT "pk_gdp_data" PRIMARY KEY (
        "data_id"
     )
);

CREATE TABLE "world_country_latitude_and_longitude" (
    "country_code" VARCHAR   NOT NULL,
    "latitude" FLOAT   NOT NULL,
    "longitude" FLOAT   NOT NULL,
    "country" VARCHAR   NOT NULL,
    CONSTRAINT "pk_world_country_latitude_and_longitude" PRIMARY KEY (
        "country"
     )
);

ALTER TABLE "suicide_data" ADD CONSTRAINT "fk_suicide_data_data_id" FOREIGN KEY("data_id")
REFERENCES "gdp_data" ("data_id");

ALTER TABLE "gdp_data" ADD CONSTRAINT "fk_gdp_data_country" FOREIGN KEY("country")
REFERENCES "world_country_latitude_and_longitude" ("country");

