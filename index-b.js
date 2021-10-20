
const _ = require("lodash");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const inserts = [];
for(let i = 0; i < 100; i++) {
    const masterValues = [];
    const values = [];

    const customerUuid = uuidv4();

    for(let t =0; t < 10000; t++) {
        masterValues.push(`(${i*10000+t+1}, '${customerUuid}')`);
        const record = [];

        record.push(`(${i*10000+t+1},'ADD_POINTS', 10, '${_.random(2010,2020)}-12-${_.padStart(_.random(1,31), 2, '0')}')`);
        record.push(`(${i*10000+t+1},'ADD_POINTS', 10, '${_.random(2010,2020)}-12-${_.padStart(_.random(1,31), 2, '0')}')`);
        record.push(`(${i*10000+t+1},'ADD_POINTS', 10, '${_.random(2010,2020)}-12-${_.padStart(_.random(1,31), 2, '0')}')`);

        values.push(record.join(",\n"));
    }

    inserts.push(`INSERT INTO history_b(id, customer_uuid) VALUES${masterValues.join(",\n")};`);
    inserts.push(`INSERT INTO history_b_results(history_b_id, type, points, expiration_date) VALUES${values};`)
}

fs.writeFileSync("./output-b.sql", "TRUNCATE history_b, history_b_results;\n\n\n"+inserts.join("\n\n"));

console.log("done");



