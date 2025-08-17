const fs = require('fs');
const { parseStringPromise, Builder } = require('xml2js');

async function mergeEPG() {
  const polska = await parseStringPromise(fs.readFileSync('./epg.ovh/pltv.xml', 'utf-8'));
  const reszta = await parseStringPromise(fs.readFileSync('./world.xml', 'utf-8'));

  // scalamy kanały
  const mergedChannels = [...(polska.tv.channel || []), ...(reszta.tv.channel || [])];
  const mergedPrograms = [...(polska.tv.programme || []), ...(reszta.tv.programme || [])];

  const merged = {
    tv: {
      $: { source_info_name: 'Combined EPG' },
      channel: mergedChannels,
      programme: mergedPrograms
    }
  };

  const builder = new Builder();
  const xml = builder.buildObject(merged);

  fs.writeFileSync('./guide.xml', xml);
  console.log('guide.xml wygenerowany!');
}

mergeEPG();
