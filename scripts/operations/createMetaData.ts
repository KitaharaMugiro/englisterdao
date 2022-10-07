'use strict';

const fs = require('fs');

for (let index = 0; index < 100; index++) {
    let num = ('000' + index).slice(-4);
    let imageFileName = `DAOmember_${num}.png`;
    let metadata = {
        "tokenId": String(index),
        "name": `EnglisterDAO Membership #${index}`,
        "description": "EnglisterDAOのメンバーである証。DAO投票のために使用できます。",
        "image": `https://yunomy-image-folder.s3.ap-northeast-1.amazonaws.com/englister/dao_membership/${imageFileName}`
    };
    let data = JSON.stringify(metadata);
    let path = `./contracts/metadata/daonft/${index}`;
    fs.writeFileSync(path, data);
}



