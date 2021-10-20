
const _ = require("lodash");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const inserts = [];
for(let i = 0; i < 100; i++) {
    const values = [];
    const customerUuid = uuidv4();
    for(let t =0; t<10000; t++) {
        const record = [];

        record.push({type: "ADD_POINTS", points: 10, expirationDate: `${_.random(2010,2020)}-12-${_.padStart(_.random(1,31), 2, '0')}`});
        record.push({type: "ADD_POINTS", points: 10, expirationDate: `${_.random(2010,2020)}-12-${_.padStart(_.random(1,31), 2, '0')}`});
        record.push({type: "ADD_POINTS", points: 10, expirationDate: `${_.random(2010,2020)}-12-${_.padStart(_.random(1,31), 2, '0')}`});

        values.push(`('${customerUuid}', '${JSON.stringify(record)}')`);
    }

    inserts.push(`INSERT INTO history_a(customer_uuid, results) VALUES ${values.join(",\n")};`)
}

fs.writeFileSync("./output-a.sql", "TRUNCATE history_a;\n\n\n"+inserts.join("\n\n"));

console.log("done");



