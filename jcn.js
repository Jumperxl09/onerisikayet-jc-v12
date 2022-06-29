const Discord = require("discord.js");
const client = new Discord.Client();
const { botToken, botOwner, botVoiceChannelID, logChannelID } = require('./ayarlar.json');
const kufurler = require(`./kufurler`);
const iletisim = require(`./iletişim.json`);

client.on("ready", async () => {
    client.user.setPresence({
        activity: {
            name: "Öneri ve Şikayet için DM",
            type: "STREAMING",
            url: "https://www.twitch.tv/jumperxl09/"
        }
    });
    let botVoiceChannel = client.channels.cache.get(botVoiceChannelID);
    if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot Ses Kanalına Bağlanamadı!"));
});

client.login(botToken).then(c => console.log(`
| !HESABA GİRİŞ BAŞARILI!  |
| KOMUTLAR VE FUNCTIONLAR  |
| TAMAMLANANA KADAR LÜT-   |
| FEN BEKLEYİNİZ...        |
| KULLANICI ADI VE TAG     |
|    ${client.user.tag}    |
`))
.catch(err => console.error(`
| TOKEN GİRİŞİ YAPILIRKEN  |
| HATA OLUŞTU! LÜTFEN      |
| TOKEN BÖLÜMÜNÜ KONTROL   |
| EDINIZ! (Jumperxl09)     |
`));

//--------------------------------------------------KOMUTLAR--------------------------------------------------\\

let oneriler = new Set();
client.on("message", async message => {
    var sahip = message.author;
    if (message.author.bot) return;
    let koruma = await client.chatKoruma(message);
    if (message.channel.type === "dm" && (koruma == null || koruma == undefined || koruma == false)) {
        if (oneriler.has(message.author.id)) return;
        let embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor("#ff0000")
        .setFooter(`${client.user.username}, ${client.user.avatarURL}`)
        .setThumbnail(message.author.avatarURL({dynamic: true}))
        .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
        .setTitle("Yeni Bir Öneri, Yeni Bir Şikayet")
        .setDescription(`
        **Üye Bilgileri:** \n
        **Üye Etiket:**
        ${message.author} \n
        **Üye ID:**
        ${message.author.id} \n
        **Öneri / Şikayet İçeriği:**
        ${message.content ? message.content.slice(0, 900) : ""}`);
        message.channel.send(`** Sistem: ** Öneri/Şikayet'in Başarılı Bir Şekilde İletildi! \n
        Bir Sonraki İletini **10 Dakika** Sonra Yapabilirsin.`);
        client.channels.cache.get(logChannelID).send(embed);
        oneriler.add(message.author.id);
        setTimeout(() => { oneriler.delete(message.author.id); }, 5 * 1000);
    };
});

console.log(`
| 30 - 70 ARASI KOMUTLAR   |
| BAŞARILI BİR ŞEKİLDE     |
| YÜKLENMİŞTİR! FUNCTION   |
| YUKLENESINDAN SONRA      |
| BOTU KULLANABILIRSINIZ   |`);

//--------------------------------------------------FUNCTION--------------------------------------------------\\
  
  client.kufurler = [kufurler];
  client.chatKoruma = async message => {
  if (!message || !message.content) return;
  let mesajIcerik = message.content;

  let inv = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;  
  if (inv.test(mesajIcerik)) return "reklamKoruma";

  let link = /(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi;  
  if (link.test(mesajIcerik)) return "linkKoruma";
  
  if (mesajIcerik.toLowerCase().includes('@everyone') || mesajIcerik.toLowerCase().includes('@here') || (message.mentions.users.size+message.mentions.roles.size) >= 5 || message.mentions.channels.size >= 5) return "etiketKoruma";
  if (isNaN(message.content.replace(/[^a-zA-ZığüşöçĞÜŞİÖÇ]+/g, "")) && mesajIcerik.replace(/[^a-zA-ZığüşöçĞÜŞİÖÇ]+/g, "") === mesajIcerik.replace(/[^a-zA-ZığüşöçĞÜŞİÖÇ]+/g, "").toUpperCase()) return "capsKoruma";
  if ((client.kufurler).some(word => new RegExp("(\\b)+(" + word + ")+(\\b)", "gui").test(mesajIcerik))) return "kufurKoruma";

  let msjlar = await message.channel.messages.fetch({ limit: 30 });
  let sonKisiMesaj = msjlar.filter(x => x.author.id === message.author.id).array()[1];
  if ((sonKisiMesaj && sonKisiMesaj.content && mesajIcerik === sonKisiMesaj.content && message.createdTimestamp - sonKisiMesaj.createdTimestamp <= 3*60*1000)) return "spamKoruma";
  
  let nativeEmojisRegExp = 
  /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  let customEmojisRegExp = /<(?:a)?:[a-z0-9_-]{1,256}:[0-9]{16,19}>/gi;
  let nativeEmojis = mesajIcerik.match(nativeEmojisRegExp) || [];
  let customEmojis = mesajIcerik.match(customEmojisRegExp) || [];
  let emojis = nativeEmojis.concat(customEmojis);
  let cleanMessage = mesajIcerik.replace(nativeEmojisRegExp, '');
  cleanMessage = cleanMessage.replace(customEmojisRegExp, '');
  cleanMessage = cleanMessage.trim();
  if (emojis.length > 5) {
    let emojiPercentage = emojis.length / (cleanMessage.length + emojis.length) * 100;
    if (emojiPercentage > 50) return "emojiSpamKoruma";
  };
  return false;
};

console.log(`
| 75 - 121 ARASI FUNCTION  |
| BAŞARILI BİR ŞEKİLDE     |
| YÜKLENMİŞTİR! ARTIK      |
| BOTU KULLANABILIRSINIZ!  |
| SORUN OLURSA BIZE BOTUN  |
| (iletişim.json) DOSYASI  |
| ILE BİZE ULAŞIN!!        |
`);
