# PostgreSQL `JSONB` evaluation
This repositorie's content helps to evaluate `JSONB` column usage comparing to the "conventional" table schema.

## How to perform tests
### 1. install Node.js dependencies
\* When you don't have Node.js installed, consider using [nvm](https://github.com/nvm-sh/nvm) to install it.
```
npm i
```

### 2. run infrastacture
```
docker-compose up
```

### 3. tables DDL
Create tables in your database.
```sql
-- variant A, where results are JSONB field
CREATE TABLE history_a
  (
     id            SERIAL PRIMARY KEY,
     customer_uuid VARCHAR,
     results       JSONB
  );

-- variant B, where results are separate table
CREATE TABLE history_b
  (
     id            SERIAL PRIMARY KEY,
     customer_uuid VARCHAR
  );

CREATE TABLE history_b_results
  (
     id              SERIAL PRIMARY KEY,
     history_b_id    INT,
     type            VARCHAR,
     points          INT,
     expiration_date DATE,
     CONSTRAINT fk_history_b FOREIGN KEY(history_b_id) REFERENCES history_b(id)
  );
```

### 4. generate test data
```bash
node index-a.js # generates output-a.sql
node index-b.js # generates output-b.sql
```

### 5. insert test data into the db
```bash
psql -h 127.0.0.1 -U test -d test -f output-a.sql
psql -h 127.0.0.1 -U test -d test -f output-b.sql
```

## benchmark
### variant A
#### count WITHOUT uuid filter
##### query
```sql
explain analyze
select
	count(*)
from
	history_a,
	jsonb_to_recordset(results) as results(type text,
	points int,
	"expirationDate" text)
where
	TO_DATE("expirationDate", 'YYYY-MM-DD') > CURRENT_DATE - 10
```
##### result
```
Execution Time: 1393.279 ms
```

#### count WITH uuid filter
##### query
\* You need to look up real `customer_uuid` first.
```sql
explain analyze
select
	count(*)
from
	history_a,
	jsonb_to_recordset(results) as results(type text,
	points int,
	"expirationDate" text)
where
	customer_uuid = '683646a0-fd7a-485f-8e7c-a1199e9ce9f1' AND
	TO_DATE("expirationDate", 'YYYY-MM-DD') > CURRENT_DATE - 10
```
##### result
```
Execution Time: 103.321 ms
```

### variant B
#### count WITHOUT uuid filter
##### query
```sql
explain analyze
select
	count(*)
from
	history_b hb
join history_b_results hbr on
	hb.id = hbr.history_b_id
where
	expiration_date > CURRENT_DATE - 10
```

#####
```
Execution Time: 208.923 ms
```

#### count WITH uuid filter
##### query
\* You need to look up real `customer_uuid` first.
```sql
explain analyze
select
	count(*)
from
	history_b hb
join history_b_results hbr on
	hb.id = hbr.history_b_id
where
	customer_uuid = '04f7ebcd-04f1-4213-ab3f-43986e33c176' and
	expiration_date > CURRENT_DATE - 10
```

##### result
```
Execution Time: 196.466 ms
```
