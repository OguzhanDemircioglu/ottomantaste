/**
 * Per-recipe one-line story hooks — surfaced under each card's tagline so the
 * grid carries a hint of provenance, not just nutritional metadata.
 *
 * Two layers:
 *   1. FAMOUS_HOOKS  — manually curated for recipes with strong attribution
 *      (Hünkâr Beğendi, Aşure, Güllaç, Baklava, etc.). Each entry is bilingual.
 *   2. fallback by   — composed from period × realm taxonomy. Generic but
 *      truthful; covers the rest of the 427-recipe corpus.
 */

import type { Lang } from './i18n';

type Bilingual = { tr: string; en: string };

/** Famous-recipe attributions. Keep entries short (≈ 60-90 chars Turkish). */
const FAMOUS_HOOKS: Record<string, Bilingual> = {
  'hunkar-begendi': {
    tr: "Sultan Abdülaziz'in 'Beğendim' sözüyle adlandırıldığı söylenen yemek.",
    en: "Said to be named after Sultan Abdülaziz's approving 'I liked it'.",
  },
  'mutancana': {
    tr: "Topkapı saray defterlerinde II. Mahmud döneminin imzası.",
    en: "Hallmark of Sultan Mahmud II's table in Topkapı palace ledgers.",
  },
  'gullac': {
    tr: "Ramazan'ın hâkim tatlısı, helvahanenin saray imzası.",
    en: "Ramadan's flagship dessert — the helvahane's signature sweet.",
  },
  'baklava': {
    tr: "Saray sünnet düğünlerinin baş tatlısı, yeniçeri 'baklava alayı' geleneğinin merkezi.",
    en: "Centerpiece of palace circumcision feasts; the janissaries' 'baklava parade' classic.",
  },
  'asure': {
    tr: "Nuh'un gemisinden bugüne — Muharrem ayının paylaşılan tatlısı.",
    en: "From Noah's ark to today — Muharram's communal sweet of forty grains.",
  },
  'kavun-dolmasi': {
    tr: "Kanuni Sultan Süleyman dönemi mevsimlik saray tarifi.",
    en: "Seasonal palace recipe traced to Suleiman the Magnificent's reign.",
  },
  'pilic-topkapi': {
    tr: "Topkapı kuşhanesinin hassas et tariflerinden.",
    en: "From Topkapı's bird-kitchen, where each fowl had its own copper pot.",
  },
  'helva-i-hakani': {
    tr: "Hakanlara ait helva — saray helvahanesinin en üst formu.",
    en: "Halva of khans — the helvahane's most refined edition.",
  },
  'sobiyet': {
    tr: "Topkapı baklava ailesinin kremamsı kuzeni.",
    en: "Topkapı baklava family's creamier cousin.",
  },
  'gul-serbeti': {
    tr: "Lale devri saray bahçesinin imza içeceği.",
    en: "Signature drink of Tulip-era palace gardens.",
  },
  'ic-pilav': {
    tr: "Saray sofrasının törensel pilavı — kuş eti ve kuru üzümle.",
    en: "Ceremonial palace pilaf, layered with bird meat and currants.",
  },
  'zerde': {
    tr: "Kandil ve düğün sofralarının safran sarısı tatlısı.",
    en: "Saffron-yellow dessert of candle nights and weddings.",
  },
  'turk-kahvesi': {
    tr: "Kanuni döneminde Yemen'den gelen, tüm sarayın günlük ritüeli.",
    en: "Imported from Yemen under Suleiman; the palace's daily ritual.",
  },
  'pastirma': {
    tr: "Kayseri'den İstanbul saray mutfağına uzanan kuru et geleneği.",
    en: "Cured-meat tradition that travelled from Kayseri to the palace kitchen.",
  },
  'borani': {
    tr: "Pers kraliçesi Pourandokht'tan adını alan tarih-öncesi yoğurtlu yemek.",
    en: "Named after Persian queen Pourandokht — yogurt dish older than the empire.",
  },
  'imam-bayildi': {
    tr: "Adından da belli — imamı bayıltacak kadar güzel zeytinyağlı patlıcan.",
    en: "The name says it: aubergine in olive oil so fine it 'made the imam swoon'.",
  },
  'kunefe': {
    tr: "Hatay-Antakya'dan yayılan, peynirli telin saray uyarlaması.",
    en: "From Hatay-Antakya: the cheese-string pastry adapted in palace kitchens.",
  },
  'aci-asure': {
    tr: "Halk sofrasında pişen, saraya ulaşmamış yöresel aşure.",
    en: "Folk-table aşure that never quite reached the palace.",
  },
  'lokma': {
    tr: "Esnaf loncalarının hayır tatlısı — saray dışında doğmuş.",
    en: "Charitable sweet of guild brotherhoods — born outside the palace.",
  },
  'paluze': {
    tr: "İran-Osmanlı geçişinin jelatinli saray tatlısı.",
    en: "Iran-to-Ottoman gelatinous palace dessert.",
  },
  'salep': {
    tr: "Kış sabahlarının saray içkisi, 17. yy Avrupa'sını fetheden Türk içeceği.",
    en: "Palace winter drink that conquered 17th-century Europe.",
  },
  'boza': {
    tr: "Yeniçeri kışlalarından sokak satıcısına — fermente Anadolu mirası.",
    en: "From janissary barracks to street vendor — fermented Anatolian legacy.",
  },
  'kebap': {
    tr: "Göçebe Türk geleneğinin sarayda inceltilmiş hâli.",
    en: "Refined-in-palace iteration of nomadic Turkic tradition.",
  },
  'sutlac': {
    tr: "Saray mutfağında 16. yüzyıldan beri kayıtlı süt tatlısı.",
    en: "Palace milk-pudding documented since the 16th century.",
  },
  'muhallebi': {
    tr: "Bizans'tan Osmanlı'ya geçen sütlü tatlının saray reçetesi.",
    en: "Palace recipe of the milk pudding inherited from Byzantium.",
  },
  // ─── Extended pool ──────────────────────────────────────────────────────
  'kazandibi': {
    tr: "Saray pastacısının yanlışlıkla yakılmış muhallebisinden doğan tatlı.",
    en: "Born of a palace pastry chef's accidentally caramelized milk pudding.",
  },
  'tavuk-gogsu': {
    tr: "II. Mehmed sofrasında belgelenen, etle yapılmış tatlı süt.",
    en: "Documented at Mehmed II's table — a sweet milk dessert built on shredded poultry.",
  },
  'kadayif': {
    tr: "Helvahanenin tel-tel sabır gerektiren imza tatlılarından.",
    en: "One of the helvahane's signature desserts that demand thread-by-thread patience.",
  },
  'revani': {
    tr: "İrmik ve şerbetin Topkapı eli sarayda buluşmuş hâli.",
    en: "Semolina-and-syrup classic refined inside Topkapı's pastry kitchen.",
  },
  'lokum': {
    tr: "Hacı Bekir'in 1777'de Bahçekapı'da açtığı dükkânla saraya giren tatlı.",
    en: "Brought to the palace through Hacı Bekir's 1777 Bahçekapı shop.",
  },
  'helva': {
    tr: "Saray helvahanesinin kuru-tava sabır işi — tüm helvaların kökeni.",
    en: "The dry-pan patience of the palace helvahane — root of every halva.",
  },
  'hosaf': {
    tr: "İftar öncesinde sofrayı açan kuru meyve şurubu.",
    en: "Dried-fruit compote that opens the table before iftar.",
  },
  'pacanga-boregi': {
    tr: "Pastırma + kaşar + yufka — modern saraya yakın özlü meze.",
    en: "Pastırma + kaşar + filo — a modern meze with palace ancestry.",
  },
  'su-boregi': {
    tr: "Yufka katmanlarının kaynar suda haşlanması — saray börekçibaşının imza tekniği.",
    en: "Layers boiled before the bake — the chief börek-maker's signature technique.",
  },
  'sigara-boregi': {
    tr: "Helvahanenin pastırma-peynir rulosu — meze-mutfak köprüsü.",
    en: "Helvahane's pastırma-cheese roll — bridge between meze and pastry.",
  },
  'manti': {
    tr: "Türkistan'dan Anadolu'ya inen, saray sofrasında küçültülerek incelenmiş hamur.",
    en: "From Turkestan to Anatolia — refined and miniaturized in the palace kitchen.",
  },
  'mercimek-corbasi': {
    tr: "Anadolu sofrasının sade temeli — saraya hiç çıkmamış halk klasiği.",
    en: "Anatolia's plainspoken foundation — folk classic that never reached the palace.",
  },
  'ezogelin-corbasi': {
    tr: "Gaziantep çorbası — kayınvalidesinden saklayan gelinin hikâyesinden.",
    en: "Gaziantep soup — born of a bride hiding her recipe from her mother-in-law.",
  },
  'tarhana-corbasi': {
    tr: "Yazın yapılıp kışa saklanan, Anadolu'nun kuru saklama bilgeliği.",
    en: "Made in summer, kept for winter — Anatolian preservation wisdom.",
  },
  'yayla-corbasi': {
    tr: "Yoğurt + nane + tereyağı — yaylada doğmuş ferahlatıcı çorba.",
    en: "Yogurt + mint + butter — a refreshing soup born in the highlands.",
  },
  'iskembe-corbasi': {
    tr: "Yeniçeri ocağının sahurdan dönüş çorbası, sokağa karışmış saray kalıntısı.",
    en: "The janissaries' pre-dawn soup; a palace remnant that spilled into the streets.",
  },
  'menemen': {
    tr: "Ege'nin sabah kahvaltısı — domates ve biberin ev formu.",
    en: "Aegean morning breakfast — the domestic form of tomato and pepper.",
  },
  'sucuklu-yumurta': {
    tr: "Anadolu kahvaltısının et + yumurta klasiği — tencere değil tava işi.",
    en: "Anatolian breakfast meat-and-egg classic — pan, never pot.",
  },
  'cilbir': {
    tr: "Saray haremi sofrasında belgelenen yoğurtlu yumurta.",
    en: "Yogurt-poached egg documented in the palace harem table.",
  },
  'kisir': {
    tr: "Güneydoğu'nun bulgur mezesi — sofraya sosyal bağ kurar.",
    en: "Southeastern bulgur meze — a dish that knits the table together.",
  },
  'haydari': {
    tr: "Süzme yoğurtla yapılan, mezelerin sade lordu.",
    en: "Strained-yogurt meze — the quiet patriarch of the table.",
  },
  'cacik': {
    tr: "Iran'dan İstanbul'a uzanan, salatalık-yoğurt yaz çorbası.",
    en: "Iranian-rooted cucumber-yogurt summer soup.",
  },
  'ezme': {
    tr: "Antep'in acı domates ezmesi — meze sofrasının kırmızı vurgusu.",
    en: "Antep's spicy tomato relish — red exclamation of the meze table.",
  },
  'sarma': {
    tr: "Asma yaprağının pirinçle nakşedilmiş sabır işi.",
    en: "Vine leaves stitched around rice — meditative work of the table.",
  },
  'dolma': {
    tr: "İçi doldurulmuş her sebze, saray defterinde ayrı bir tarif.",
    en: "Every stuffed vegetable carries its own page in palace ledgers.",
  },
  'biber-dolmasi': {
    tr: "Yaz biberinin pirinç + et içiyle saraya kabul oluşu.",
    en: "Summer pepper meets rice and meat — accepted into palace tables.",
  },
  'lahana-dolmasi': {
    tr: "Karadeniz'in turşulu yaprağıyla soğuktan korunan kış dolması.",
    en: "Black Sea winter dolma, wrapped in the leaves of pickled cabbage.",
  },
  'iskender': {
    tr: "Bursalı İskender Efendi'nin 1867'de yarattığı dikey döner.",
    en: "Vertical kebab invented by İskender Efendi of Bursa in 1867.",
  },
  'doner': {
    tr: "Bursa'dan dünyaya açılan dikey ızgaranın saraya hiç girmemiş hâli.",
    en: "Bursa's vertical grill — the form that never made it into the palace.",
  },
  'kofte': {
    tr: "Anadolu'nun sayısız bölgesel köftesi — tek bir kalıbın yüzlerce yorumu.",
    en: "Anatolia's hundreds of regional köfte — a single mold, endless variations.",
  },
  'sis-kebap': {
    tr: "Çoban ateşinin saraya çıkmış inceltilmiş şişi.",
    en: "Refined version of the shepherd's fire-skewer, allowed at palace tables.",
  },
  'adana-kebap': {
    tr: "Adana'nın acı-tatlı dengesi — sokağın saraya cevabı.",
    en: "Adana's hot-mild balance — the street's reply to the palace kebab.",
  },
  'kuzu-tandir': {
    tr: "Toprak fırının sabırlı yavaş pişirimi — Anadolu'nun göçebe mirası.",
    en: "Earth oven's patient slow cook — Anatolia's nomadic heritage.",
  },
  'kuzu-haslama': {
    tr: "Saray hasta sofrasında belgelenen, en sade haşlanmış et.",
    en: "Plain-boiled lamb documented in the palace's convalescent table.",
  },
  'kuzu-kapama': {
    tr: "Bahar mevsiminde taze soğanla pişen lordlar yemeği.",
    en: "Lord's spring dish — lamb cooked with green onions and dill.",
  },
  'kuru-fasulye': {
    tr: "Pilav-yanı milli klasik — saraya çıkmamış ev sofrasının lokomotifi.",
    en: "Rice's national companion — the locomotive of the home table.",
  },
  'nohut-yemegi': {
    tr: "Kuru baklagilin saraydaki nadir görünüşü — perhiz sofrası.",
    en: "Rare appearance of dried legumes in the palace — fasting-table fare.",
  },
  'pilav-ustu-tavuk': {
    tr: "Saray sofrasının törensel tabağı, kuş eti ve baharatla yüklü.",
    en: "Ceremonial palace plate — fowl atop pilaf, layered with spice.",
  },
  'bulgur-pilavi': {
    tr: "Anadolu'nun pirinçten önce gelen tahılı — sade kuvvetli tabak.",
    en: "Anatolia's grain that predated rice — a plain, sturdy plate.",
  },
  'sehriye-pilavi': {
    tr: "Tel şehriyeyi pirinçle birleştiren ev klasiği.",
    en: "Home classic that marries vermicelli with rice.",
  },
  'fava': {
    tr: "Yaz mezesinin püresi — bakla ve dilin ortak inceliği.",
    en: "Summer meze purée — fava beans and tongue united by elegance.",
  },
  'kurabiye': {
    tr: "Saray sofrasının çay-yanı kuru pastası — un + tereyağı sabit.",
    en: "Palace tea-side dry pastry — flour and butter, never less.",
  },
  'bademezmesi': {
    tr: "Helvahanenin badem ezmesi — şekerlemenin mütevazı atası.",
    en: "Almond paste of the helvahane — the modest ancestor of confections.",
  },
  'siyah-dut-pekmezi': {
    tr: "Anadolu'nun siyah dutla yapılmış kış konsantresi.",
    en: "Anatolia's winter concentrate, distilled from black mulberries.",
  },
  'pekmez': {
    tr: "Üzümün kaynayarak çekilmiş hâli — Anadolu'nun şeker öncesi tatlı kaynağı.",
    en: "Boiled-down grape molasses — Anatolia's pre-sugar source of sweetness.",
  },
  'turk-kahvesi-1': {
    tr: "1554'te Şam'dan İstanbul'a gelen, ilk kahvehanenin doğumuna yol açan içecek.",
    en: "Arrived from Damascus to Istanbul in 1554, sparking the first coffeehouse.",
  },
  'kuyu-kebap': {
    tr: "Toprağa kazılmış kuyuda asılan kuzu — Aksaray-Karaman tören yemeği.",
    en: "Lamb hung in an earth pit — Aksaray-Karaman ceremonial cook.",
  },
  'cag-kebap': {
    tr: "Erzurum'un yatay döneri — saraya değil askere yetişen tarif.",
    en: "Erzurum's horizontal kebab — fed armies, not palaces.",
  },
  'pirpirim-asi': {
    tr: "Semizotunun Anadolu'da bulgurla buluştuğu kuvvetli ana yemek.",
    en: "Where purslane meets bulgur in Anatolia — a robust main.",
  },
  'analikizli-koftesi': {
    tr: "İçinde küçük köfteler saklayan büyük köfte — anne-kız simgeselliği.",
    en: "Larger köfte hiding smaller köfte inside — symbolizing mother and child.",
  },
  'mantarli-pilav': {
    tr: "Saray ormanlarından mantar + pirinç + tereyağı.",
    en: "Mushrooms from royal forests, joined to rice and butter.",
  },
};

const PERIOD_LABEL: Record<string, Bilingual> = {
  erken: { tr: 'erken Osmanlı', en: 'early Ottoman' },
  klasik: { tr: 'klasik dönem', en: 'classical era' },
  lale: { tr: 'Lale devri', en: 'Tulip era' },
  tanzimat: { tr: 'Tanzimat dönemi', en: 'Tanzimat era' },
  gec: { tr: 'geç Osmanlı', en: 'late Ottoman' },
};

/** Phrasings keyed by realm; period is interpolated. */
const REALM_TEMPLATES: Record<string, (periodLabel: string, lang: Lang) => string> = {
  saray: (p, l) =>
    l === 'en'
      ? `From the palace kitchen, ${p}.`
      : `Saray mutfağından — ${p} kayıtlarından.`,
  halk: (p, l) =>
    l === 'en'
      ? `Folk table classic of the ${p}.`
      : `Halk sofrasının ${p} klasiği.`,
  tekke: (p, l) =>
    l === 'en'
      ? `Dervish-lodge kitchens, ${p}.`
      : `Tekke ve dergâh mutfaklarından, ${p}.`,
};

export function getStoryHook(args: {
  slug: string;
  period?: string;
  realm?: string;
  lang: Lang;
}): string | null {
  const { slug, period, realm, lang } = args;
  const famous = FAMOUS_HOOKS[slug];
  if (famous) return famous[lang];

  if (realm && period) {
    const tmpl = REALM_TEMPLATES[realm];
    const periodLabel = PERIOD_LABEL[period]?.[lang] ?? period;
    if (tmpl) return tmpl(periodLabel, lang);
  }

  // Last resort — period-only hook
  if (period && PERIOD_LABEL[period]) {
    return lang === 'en'
      ? `A ${PERIOD_LABEL[period].en} recipe.`
      : `${PERIOD_LABEL[period].tr.charAt(0).toLocaleUpperCase('tr')}${PERIOD_LABEL[period].tr.slice(1)} tarifi.`;
  }

  return null;
}
