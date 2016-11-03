const csv = require('csv');
const fs = require('fs');
const fetch = require( "node-fetch" );
const access = require( "./access.json" );

const createAuthenticationHeader = (username, password) => {
  return "Basic " + new Buffer( username + ":" + password ).toString( "base64" );
};

fetch(
  "http://dhis.academy/lao_25/api/25/analytics.json?dimension=dx:Q21U47uf0xo.REPORTING_RATE;Fpl26CKBEqZ.REPORTING_RATE;xm6LbvmURdm.REPORTING_RATE;eDXUmwx0yw8.REPORTING_RATE&dimension=pe:LAST_3_MONTHS&dimension=ou:IWp9dQGM0bS;OU_GROUP-jblbYwuvO33;OU_GROUP-gHfSdwPrC83&displayProperty=SHORTNAME&outputIdScheme=UID",
  {
    headers: {
      Authorization: createAuthenticationHeader( access.username, access.password )
    }
  }
)
  .then( result => result.json() )
  .then( data => TransformMap( data ) );

const TransformMap = data => {
  outputCsv( data.rows.map( row => {
    return [
      data.metaData.names[row[0]],
      row[1],
      data.metaData.names[row[2]],
      row[3]
    ];
  } ) )
};

const outputCsv = rows => {
	//console.log(rows);
	
	csv.stringify( rows, function(err, output )
	{
		fs.writeFile("analytics.csv", output, function(err) {
			if(err) {
				return console.log(err);
			}

			console.log("The file was saved!");
		});
	});
};